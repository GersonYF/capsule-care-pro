import { ScreenCard } from "../ScreenCard";
import { Check, X, TrendingUp, Calendar as CalendarIcon, Download } from "lucide-react";
import { useGetMedicationIntakesQuery } from "@/store/api/notificationsApi";
import { useGetUserMedicationsQuery } from "@/store/api/medicationsApi";
import { format, subDays, parseISO, startOfDay } from "date-fns";
import { es } from "date-fns/locale";

export const ConsumptionHistory = () => {
  const { data: intakesData, isLoading: loadingIntakes } = useGetMedicationIntakesQuery({
    page: 1,
    per_page: 100,
  });
  
  const { data: medicationsData, isLoading: loadingMeds } = useGetUserMedicationsQuery();

  const today = new Date();
  const weekDays = Array.from({ length: 7 }, (_, i) => subDays(today, 6 - i));

  const medications = medicationsData?.medications || [];
  
  // Filter unique medications
  const uniqueMedications = medications.reduce((acc, med) => {
    if (med.is_active) {
      const existingIndex = acc.findIndex(m => 
        m.medication?.id === med.medication?.id || 
        m.custom_name === med.custom_name
      );
      
      if (existingIndex === -1) {
        acc.push(med);
      }
    }
    return acc;
  }, [] as typeof medications);

  const activeMedications = uniqueMedications;

  const getExpectedDosesPerDay = (frequency: string) => {
    if (!frequency) return 1;
    
    const lower = frequency.toLowerCase().trim();
    
    if (
      lower.includes('dos veces') || 
      lower.includes('2 veces') || 
      lower.includes('twice')
    ) return 2;
    
    if (
      lower.includes('tres veces') || 
      lower.includes('3 veces') || 
      lower.includes('three times')
    ) return 3;
    
    if (
      lower.includes('cuatro veces') || 
      lower.includes('4 veces') || 
      lower.includes('four times')
    ) return 4;
    
    if (lower.includes('cada 12 horas') || lower.includes('every 12 hours')) return 2;
    if (lower.includes('cada 8 horas') || lower.includes('every 8 hours')) return 3;
    if (lower.includes('cada 6 horas') || lower.includes('every 6 hours')) return 4;
    
    return 1;
  };

  const expectedDosesPerDay = activeMedications.reduce((total, med) => {
    const doses = getExpectedDosesPerDay(med.prescribed_frequency || '');
    return total + doses;
  }, 0);

  const finalExpectedDoses = expectedDosesPerDay > 0 ? expectedDosesPerDay : activeMedications.length;

  // MEJORADO: Comparación por string de fecha en lugar de isSameDay
  const weekStatus = weekDays.map(day => {
    const dayStr = format(startOfDay(day), 'yyyy-MM-dd');
    
    const dayIntakes = intakesData?.intakes?.filter(intake => {
      if (!intake.status_at) return false;
      
      // Extraer solo la fecha (sin hora) del status_at
      const intakeDateStr = intake.status_at.split('T')[0];
      
      return intakeDateStr === dayStr && intake.status === 'taken';
    }) || [];

    const takenCount = dayIntakes.length;
    const adherenceRate = finalExpectedDoses > 0 
      ? (takenCount / finalExpectedDoses) * 100 
      : 0;

    return {
      date: day,
      takenCount,
      expectedCount: finalExpectedDoses,
      adherenceRate,
      isCompliant: adherenceRate >= 80,
    };
  });

  // Calculate weekly adherence
  const totalTaken = weekStatus.reduce((sum, day) => sum + day.takenCount, 0);
  const totalExpected = weekStatus.reduce((sum, day) => sum + day.expectedCount, 0);
  const adherencePercentage = totalExpected > 0 
    ? Math.round((totalTaken / totalExpected) * 100) 
    : 0;

  // Group intakes by date
  const intakesByDate = intakesData?.intakes?.reduce((acc, intake) => {
    if (intake.status_at) {
      const dateKey = intake.status_at.split('T')[0];
      if (!acc[dateKey]) acc[dateKey] = [];
      acc[dateKey].push(intake);
    }
    return acc;
  }, {} as Record<string, typeof intakesData.intakes>) || {};

  const sortedDates = Object.keys(intakesByDate).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  ).slice(0, 14);

  const getMedicationName = (userMedicationId: number) => {
    const med = medications.find(m => m.id === userMedicationId);
    return med?.custom_name || med?.medication?.name || 'Medicamento';
  };

  // Función para descargar CSV
  const downloadCSV = () => {
    // Preparar datos para CSV
    const csvData = [];
    
    // Encabezado
    csvData.push(['Fecha', 'Medicamento', 'Dosis', 'Estado', 'Hora', 'Notas']);
    
    // Datos ordenados por fecha (más reciente primero)
    sortedDates.forEach(dateStr => {
      const intakes = intakesByDate[dateStr];
      const date = parseISO(dateStr);
      const formattedDate = format(date, 'dd/MM/yyyy', { locale: es });
      
      intakes.forEach(intake => {
        const medicationName = getMedicationName(intake.user_medication_id);
        const dosage = intake.dosage_taken || 'N/A';
        const status = intake.status === 'taken' ? 'Tomado' : 
                      intake.status === 'skipped' ? 'Omitido' : 'Perdido';
        const time = intake.status_at ? format(parseISO(intake.status_at), 'HH:mm') : '--:--';
        const notes = intake.notes || '';
        
        csvData.push([formattedDate, medicationName, dosage, status, time, notes]);
      });
    });
    
    // Agregar resumen al final
    csvData.push([]);
    csvData.push(['RESUMEN DE ADHERENCIA']);
    csvData.push(['Período', `Últimos 7 días (${format(weekDays[0], 'dd/MM/yyyy')} - ${format(weekDays[6], 'dd/MM/yyyy')})`]);
    csvData.push(['Dosis tomadas', totalTaken.toString()]);
    csvData.push(['Dosis esperadas', totalExpected.toString()]);
    csvData.push(['Adherencia', `${adherencePercentage}%`]);
    csvData.push([]);
    csvData.push(['Tomados', intakesData?.intakes?.filter(i => i.status === 'taken').length.toString() || '0']);
    csvData.push(['Omitidos', intakesData?.intakes?.filter(i => i.status === 'skipped').length.toString() || '0']);
    csvData.push(['Perdidos', intakesData?.intakes?.filter(i => i.status === 'missed').length.toString() || '0']);
    
    // Convertir a formato CSV
    const csvContent = csvData.map(row => 
      row.map(cell => `"${cell}"`).join(',')
    ).join('\n');
    
    // Agregar BOM para soporte de caracteres UTF-8 en Excel
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
    
    // Crear enlace de descarga
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `adherencia_medicamentos_${format(today, 'yyyy-MM-dd')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loadingIntakes || loadingMeds) {
    return (
      <ScreenCard title="Historial de consumo">
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Cargando historial...</p>
        </div>
      </ScreenCard>
    );
  }

  return (
    <ScreenCard 
      title="Historial de consumo"
      action={
        intakesData?.intakes && intakesData.intakes.length > 0 && (
          <button
            onClick={downloadCSV}
            className="flex items-center space-x-2 px-3 py-1.5 text-sm font-medium text-primary bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Descargar CSV</span>
          </button>
        )
      }
    >
      <div className="space-y-6">
        {/* Week Overview */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-sm font-semibold text-gray-700">Últimos 7 días</h2>
              <p className="text-xs text-gray-500">
                {totalTaken} de {totalExpected} dosis tomadas
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <TrendingUp className={`w-4 h-4 ${adherencePercentage >= 80 ? 'text-green-500' : adherencePercentage >= 50 ? 'text-yellow-500' : 'text-red-500'}`} />
              <span className={`text-sm font-bold ${adherencePercentage >= 80 ? 'text-green-500' : adherencePercentage >= 50 ? 'text-yellow-500' : 'text-red-500'}`}>
                {adherencePercentage}%
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-7 gap-2">
            {weekStatus.map((day, index) => {
              const isToday = format(day.date, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd');
              
              return (
                <div 
                  key={index}
                  className="flex flex-col items-center"
                >
                  <div 
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      day.isCompliant
                        ? 'bg-green-500 text-white' 
                        : day.takenCount > 0
                        ? 'bg-yellow-400 text-white'
                        : 'bg-gray-200 text-gray-400'
                    } ${isToday ? 'ring-2 ring-primary ring-offset-2' : ''}`}
                    title={`${format(day.date, 'd MMM', { locale: es })}: ${day.takenCount}/${day.expectedCount} dosis (${Math.round(day.adherenceRate)}%)`}
                  >
                    {day.isCompliant ? (
                      <Check className="w-5 h-5" />
                    ) : day.takenCount > 0 ? (
                      <span className="text-xs font-bold">{day.takenCount}</span>
                    ) : (
                      <X className="w-5 h-5" />
                    )}
                  </div>
                  <span className={`text-xs mt-1 capitalize ${isToday ? 'font-bold text-primary' : 'text-gray-500'}`}>
                    {format(day.date, 'EEE', { locale: es })}
                  </span>
                  <span className="text-[10px] text-gray-400">
                    {format(day.date, 'd', { locale: es })}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Daily History */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-700">Historial detallado</h3>
          
          {sortedDates.length === 0 ? (
            <div className="text-center py-8">
              <CalendarIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">No hay registros de consumo todavía</p>
              <p className="text-gray-400 text-xs mt-1">Comienza a registrar tus medicamentos</p>
            </div>
          ) : (
            sortedDates.map(dateStr => {
              const intakes = intakesByDate[dateStr];
              const date = parseISO(dateStr);
              const isToday = format(today, 'yyyy-MM-dd') === dateStr;
              const isYesterday = format(subDays(today, 1), 'yyyy-MM-dd') === dateStr;
              
              let dateLabel = format(date, 'EEEE, d MMM', { locale: es });
              if (isToday) dateLabel = 'Hoy';
              if (isYesterday) dateLabel = 'Ayer';

              const dailyTaken = intakes.filter(i => i.status === 'taken').length;
              const dailyAdherence = finalExpectedDoses > 0 
                ? Math.round((dailyTaken / finalExpectedDoses) * 100)
                : 0;

              return (
                <div key={dateStr} className="border-b border-gray-100 pb-3 last:border-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-semibold text-gray-900 capitalize">
                      {dateLabel}
                    </div>
                    <div className={`text-xs font-medium ${
                      dailyAdherence >= 80 ? 'text-green-600' : 
                      dailyAdherence >= 50 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {dailyTaken}/{finalExpectedDoses} ({dailyAdherence}%)
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    {intakes.map((intake) => (
                      <div 
                        key={intake.id} 
                        className="flex items-center justify-between text-sm bg-gray-50 rounded-lg p-2"
                      >
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${
                            intake.status === 'taken' ? 'bg-green-500' : 
                            intake.status === 'skipped' ? 'bg-yellow-500' : 'bg-red-500'
                          }`} />
                          <span className="font-medium text-gray-900">
                            {getMedicationName(intake.user_medication_id)}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          {intake.dosage_taken && (
                            <span className="text-xs text-gray-500">
                              {intake.dosage_taken}
                            </span>
                          )}
                          <span className={`text-xs font-medium ${
                            intake.status === 'taken' ? 'text-green-600' : 
                            intake.status === 'skipped' ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {intake.status_at 
                              ? format(parseISO(intake.status_at), 'HH:mm')
                              : '--:--'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Summary Stats */}
        {intakesData?.intakes && intakesData.intakes.length > 0 && (
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-green-600">
                {intakesData.intakes.filter(i => i.status === 'taken').length}
              </div>
              <div className="text-xs text-green-700 mt-1">Tomados</div>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {intakesData.intakes.filter(i => i.status === 'skipped').length}
              </div>
              <div className="text-xs text-yellow-700 mt-1">Omitidos</div>
            </div>
            
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-red-600">
                {intakesData.intakes.filter(i => i.status === 'missed').length}
              </div>
              <div className="text-xs text-red-700 mt-1">Perdidos</div>
            </div>
          </div>
        )}
      </div>
    </ScreenCard>
  );
};
