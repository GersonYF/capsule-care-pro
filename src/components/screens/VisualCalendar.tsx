import { useState } from "react";
import { ScreenCard } from "../ScreenCard";
import { Check, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGetUserMedicationsQuery } from "@/store/api/medicationsApi";
import { useGetRemindersQuery } from "@/store/api/remindersApi";
import { useGetMedicationIntakesQuery } from "@/store/api/notificationsApi";
import { format, startOfWeek, addDays, isToday, startOfMonth, endOfMonth, isSameDay, addMonths, subMonths, addWeeks, subWeeks } from "date-fns";
import { es } from "date-fns/locale";

type ViewMode = 'daily' | 'weekly' | 'monthly';

export const VisualCalendar = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('weekly');
  const [currentDate, setCurrentDate] = useState(new Date());

  const { data: medicationsData, isLoading: loadingMeds } = useGetUserMedicationsQuery();
  const { data: remindersData, isLoading: loadingReminders } = useGetRemindersQuery();
  const { data: intakesData, isLoading: loadingIntakes } = useGetMedicationIntakesQuery({
    page: 1,
    per_page: 500,
  });

  const getExpectedDoses = (frequency: string) => {
    const dosesMap: Record<string, number> = {
      'once_daily': 1,
      'twice_daily': 2,
      'three_times_daily': 3,
      'four_times_daily': 4,
      'every_4_hours': 6,
      'every_6_hours': 4,
      'every_8_hours': 3,
      'every_12_hours': 2,
      'as_needed': 0,
      'weekly': 0.14,
    };
    return dosesMap[frequency] || 1;
  };

  const getDayStatus = (day: Date, medId?: number) => {
    const dayStr = format(day, 'yyyy-MM-dd');
    const intakes = intakesData?.intakes?.filter(intake => 
      intake.status_at?.startsWith(dayStr) && intake.status === 'taken'
    ) || [];
    
    if (medId) {
      const med = activeMedications.find(m => m.id === medId);
      const expectedDoses = med ? getExpectedDoses(med.prescribed_frequency || '') : 1;
      const takenCount = intakes.filter(i => i.user_medication_id === medId).length;
      
      return {
        taken: takenCount > 0,
        complete: expectedDoses === 0 || takenCount >= expectedDoses,
        count: takenCount,
        expected: expectedDoses
      };
    }
    
    return intakes.length > 0;
  };

  const getAllMedsStatus = (day: Date) => {
    const dayStr = format(day, 'yyyy-MM-dd');
    let totalExpected = 0;
    let totalTaken = 0;
    
    activeMedications.forEach(med => {
      const expected = getExpectedDoses(med.prescribed_frequency || '');
      if (expected > 0) {
        totalExpected += expected;
        const taken = intakesData?.intakes?.filter(intake => 
          intake.status_at?.startsWith(dayStr) && 
          intake.status === 'taken' &&
          intake.user_medication_id === med.id
        ).length || 0;
        totalTaken += taken;
      }
    });
    
    return {
      complete: totalExpected > 0 && totalTaken >= totalExpected,
      partial: totalTaken > 0 && totalTaken < totalExpected,
      percentage: totalExpected > 0 ? Math.round((totalTaken / totalExpected) * 100) : 0
    };
  };

  const getFrequencyText = (frequency: string) => {
    const frequencyMap: Record<string, string> = {
      'once_daily': '1x/día',
      'twice_daily': '2x/día',
      'three_times_daily': '3x/día',
      'four_times_daily': '4x/día',
      'every_4_hours': 'c/4h',
      'every_6_hours': 'c/6h',
      'every_8_hours': 'c/8h',
      'every_12_hours': 'c/12h',
      'as_needed': 'PRN',
      'weekly': '1x/sem',
    };
    return frequencyMap[frequency] || frequency;
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    if (viewMode === 'daily') {
      setCurrentDate(direction === 'prev' ? addDays(currentDate, -1) : addDays(currentDate, 1));
    } else if (viewMode === 'weekly') {
      setCurrentDate(direction === 'prev' ? subWeeks(currentDate, 1) : addWeeks(currentDate, 1));
    } else {
      setCurrentDate(direction === 'prev' ? subMonths(currentDate, 1) : addMonths(currentDate, 1));
    }
  };

  if (loadingMeds || loadingReminders || loadingIntakes) {
    return (
      <ScreenCard title="Calendario de tratamiento">
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Cargando...</p>
        </div>
      </ScreenCard>
    );
  }

  const activeMedications = medicationsData?.medications?.filter(m => m.is_active) || [];
  const activeReminders = remindersData?.reminders?.filter(r => r.is_active) || [];

  const renderDailyView = () => {
    const dayMeds = activeMedications.map(med => {
      const medReminders = activeReminders.filter(r => r.user_medication_id === med.id);
      const status = getDayStatus(currentDate, med.id);
      return { med, reminders: medReminders, status };
    });

    return (
      <div className="space-y-3">
        {dayMeds.map(({ med, reminders, status }) => {
          const statusObj = typeof status === 'object' ? status : { taken: status, complete: status, count: 0, expected: 0 };
          const showProgress = statusObj.expected > 0;
          
          return (
            <div key={med.id} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${
                      statusObj.complete ? 'bg-green-500' : 
                      statusObj.taken ? 'bg-yellow-500' : 
                      'bg-gray-300'
                    }`} />
                    <h4 className="font-semibold text-gray-900">{med.custom_name}</h4>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                      {getFrequencyText(med.prescribed_frequency || '')}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{med.prescribed_dosage}</p>
                  
                  {showProgress && (
                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all ${
                            statusObj.complete ? 'bg-green-500' : 'bg-yellow-500'
                          }`}
                          style={{ width: `${Math.min((statusObj.count / statusObj.expected) * 100, 100)}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-600 font-medium">
                        {statusObj.count}/{statusObj.expected}
                      </span>
                    </div>
                  )}
                  
                  {reminders.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {reminders.map(r => (
                        <div key={r.id} className="flex items-center text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                          <Clock className="w-3 h-3 mr-1" />
                          {r.reminder_time}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderWeeklyView = () => {
    const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
    const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-7 gap-2">
          {weekDays.map((day, index) => {
            const dayStatus = getAllMedsStatus(day);
            const isCurrentDay = isToday(day);
            
            return (
              <div key={index} className="text-center">
                <div className={`text-xs font-medium mb-2 ${isCurrentDay ? 'text-primary' : 'text-gray-600'}`}>
                  {format(day, 'EEE', { locale: es })}
                </div>
                <div className={`w-full aspect-square rounded-lg flex flex-col items-center justify-center relative ${
                  dayStatus.complete
                    ? 'bg-green-500 text-white' 
                    : dayStatus.partial
                    ? 'bg-yellow-500 text-white'
                    : isCurrentDay
                    ? 'bg-primary/20 text-primary border-2 border-primary'
                    : 'bg-gray-100 text-gray-400'
                }`}>
                  {dayStatus.complete ? (
                    <Check className="w-5 h-5" />
                  ) : dayStatus.partial ? (
                    <>
                      <div className="text-xs font-bold">{format(day, 'd')}</div>
                      <div className="text-[10px] mt-0.5">{dayStatus.percentage}%</div>
                    </>
                  ) : (
                    <div className="text-sm font-bold">{format(day, 'd')}</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-gray-700">Medicamentos activos</h3>
          {activeMedications.map((med) => {
            const medReminders = activeReminders.filter(r => r.user_medication_id === med.id);
            const expectedDoses = getExpectedDoses(med.prescribed_frequency || '');
            
            return (
              <div key={med.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-1 h-12 bg-primary rounded-full" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm">{med.custom_name}</span>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                      {getFrequencyText(med.prescribed_frequency || '')}
                    </span>
                    {expectedDoses > 0 && (
                      <span className="text-xs text-gray-500">
                        ({expectedDoses}x/día)
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-gray-600">{med.prescribed_dosage}</div>
                  {medReminders.length > 0 && (
                    <div className="flex items-center mt-1 text-xs text-primary">
                      <Clock className="w-3 h-3 mr-1" />
                      {medReminders.map(r => r.reminder_time).join(', ')}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderMonthlyView = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDate = addDays(monthEnd, 7);
    
    const days: Date[] = [];
    let day = startDate;
    while (day < endDate) {
      days.push(day);
      day = addDays(day, 1);
    }

    const weeks = days.reduce((acc, day, i) => {
      if (i % 7 === 0) acc.push([]);
      acc[acc.length - 1].push(day);
      return acc;
    }, [] as Date[][]);

    return (
      <div className="space-y-3">
        <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-gray-600 mb-2">
          {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((d, i) => (
            <div key={i}>{d}</div>
          ))}
        </div>
        
        {weeks.map((week, weekIdx) => (
          <div key={weekIdx} className="grid grid-cols-7 gap-1">
            {week.map((day, dayIdx) => {
              const isCurrentMonth = day >= monthStart && day <= monthEnd;
              const dayStatus = getAllMedsStatus(day);
              const isCurrentDay = isToday(day);
              
              let bgColor = 'bg-gray-100 text-gray-700';
              if (!isCurrentMonth) {
                bgColor = 'bg-transparent text-gray-300';
              } else if (isCurrentDay) {
                bgColor = 'bg-primary text-white font-semibold';
              } else if (dayStatus.complete) {
                bgColor = 'bg-green-500 text-white font-semibold';
              } else if (dayStatus.partial) {
                const intensity = Math.round(dayStatus.percentage / 25);
                if (intensity === 3) bgColor = 'bg-yellow-400 text-white font-semibold';
                else if (intensity === 2) bgColor = 'bg-yellow-300 text-gray-900 font-semibold';
                else bgColor = 'bg-yellow-200 text-gray-900';
              }
              
              return (
                <div
                  key={dayIdx}
                  className={`aspect-square rounded-lg flex flex-col items-center justify-center text-xs ${bgColor}`}
                >
                  <div>{format(day, 'd')}</div>
                  {isCurrentMonth && dayStatus.partial && (
                    <div className="text-[9px] leading-none mt-0.5">{dayStatus.percentage}%</div>
                  )}
                </div>
              );
            })}
          </div>
        ))}

        <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded" />
            <span>Completo</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-400 rounded" />
            <span>Parcial</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-100 rounded border border-gray-300" />
            <span>Pendiente</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-primary rounded" />
            <span>Hoy</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <ScreenCard title="Calendario de tratamiento">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
            {(['daily', 'weekly', 'monthly'] as ViewMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  viewMode === mode
                    ? 'bg-white text-primary shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {mode === 'daily' ? 'Día' : mode === 'weekly' ? 'Semana' : 'Mes'}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => navigateDate('prev')}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setCurrentDate(new Date())}
              className="min-w-[120px]"
            >
              <span className="text-sm font-medium">
                {viewMode === 'daily'
                  ? format(currentDate, 'd MMM yyyy', { locale: es })
                  : viewMode === 'weekly'
                  ? `Semana ${format(currentDate, 'w, yyyy')}`
                  : format(currentDate, 'MMMM yyyy', { locale: es })}
              </span>
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigateDate('next')}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {viewMode === 'daily' && renderDailyView()}
        {viewMode === 'weekly' && renderWeeklyView()}
        {viewMode === 'monthly' && renderMonthlyView()}

        {activeMedications.length === 0 && (
          <div className="text-center py-8 text-gray-500 text-sm">
            No tienes medicamentos registrados
          </div>
        )}
      </div>
    </ScreenCard>
  );
};