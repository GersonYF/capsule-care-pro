import { ScreenCard } from "../ScreenCard";
import { Check, X, TrendingUp, Calendar as CalendarIcon } from "lucide-react";
import { useGetMedicationIntakesQuery } from "@/store/api/notificationsApi";
import { useGetUserMedicationsQuery } from "@/store/api/medicationsApi";
import { format, startOfWeek, addDays, parseISO, startOfDay } from "date-fns";
import { es } from "date-fns/locale";

export const ConsumptionHistory = () => {
  const { data: intakesData, isLoading: loadingIntakes } = useGetMedicationIntakesQuery({
    page: 1,
    per_page: 50,
  });
  
  const { data: medicationsData, isLoading: loadingMeds } = useGetUserMedicationsQuery();

  // Get current week (Monday to Friday)
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 5 }, (_, i) => addDays(weekStart, i));

  // Check if medication was taken each day
  const weekStatus = weekDays.map(day => {
    const dayStr = format(day, 'yyyy-MM-dd');
    return intakesData?.intakes?.some(intake => 
      intake.status_at?.startsWith(dayStr) && intake.status === 'taken'
    ) || false;
  });

  // Calculate adherence percentage
  const takenCount = weekStatus.filter(Boolean).length;
  const adherencePercentage = weekStatus.length > 0 
    ? Math.round((takenCount / weekStatus.length) * 100) 
    : 0;

  // Group intakes by date
  const intakesByDate = intakesData?.intakes?.reduce((acc, intake) => {
    if (intake.status_at) {
      const dateKey = format(parseISO(intake.status_at), 'yyyy-MM-dd');
      if (!acc[dateKey]) acc[dateKey] = [];
      acc[dateKey].push(intake);
    }
    return acc;
  }, {} as Record<string, typeof intakesData.intakes>) || {};

  // Get sorted dates
  const sortedDates = Object.keys(intakesByDate).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  ).slice(0, 7);

  if (loadingIntakes || loadingMeds) {
    return (
      <ScreenCard title="Historial de consumo">
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Cargando historial...</p>
        </div>
      </ScreenCard>
    );
  }

  const medications = medicationsData?.medications || [];

  // Get medication name by ID
  const getMedicationName = (userMedicationId: number) => {
    const med = medications.find(m => m.id === userMedicationId);
    return med?.custom_name || med?.medication?.name || 'Medicamento';
  };

  return (
    <ScreenCard title="Historial de consumo">
      <div className="space-y-6">
        {/* Week Overview */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-700">Esta semana</h2>
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              <span className="text-sm font-bold text-primary">{adherencePercentage}%</span>
            </div>
          </div>
          <div className="flex space-x-3">
            {weekStatus.map((completed, index) => (
              <div 
                key={index} 
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  completed 
                    ? 'bg-primary text-white' 
                    : 'bg-gray-200 text-gray-400'
                }`}
              >
                {completed ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <X className="w-5 h-5" />
                )}
              </div>
            ))}
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
              const isToday = format(new Date(), 'yyyy-MM-dd') === dateStr;
              const isYesterday = format(addDays(new Date(), -1), 'yyyy-MM-dd') === dateStr;
              
              let dateLabel = format(date, 'EEEE, d MMM', { locale: es });
              if (isToday) dateLabel = 'Hoy';
              if (isYesterday) dateLabel = 'Ayer';

              return (
                <div key={dateStr} className="border-b border-gray-100 pb-3 last:border-0">
                  <div className="text-sm font-semibold text-gray-900 mb-2 capitalize">
                    {dateLabel}
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
