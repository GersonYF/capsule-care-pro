import { ScreenCard } from "../ScreenCard";
import { Check, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGetUserMedicationsQuery } from "@/store/api/medicationsApi";
import { useGetRemindersQuery } from "@/store/api/remindersApi";
import { useGetMedicationIntakesQuery } from "@/store/api/notificationsApi";
import { format, startOfWeek, addDays, isToday } from "date-fns";
import { es } from "date-fns/locale";

export const VisualCalendar = () => {
  const { data: medicationsData, isLoading: loadingMeds } = useGetUserMedicationsQuery();
  const { data: remindersData, isLoading: loadingReminders } = useGetRemindersQuery();
  const { data: intakesData, isLoading: loadingIntakes } = useGetMedicationIntakesQuery({
    page: 1,
    per_page: 100,
  });

  // Get current week (Monday to Friday)
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 5 }, (_, i) => addDays(weekStart, i));

  // Check medication intake status for each day
  const getDayStatus = (day: Date) => {
    const dayStr = format(day, 'yyyy-MM-dd');
    return intakesData?.intakes?.some(intake => 
      intake.status_at?.startsWith(dayStr) && intake.status === 'taken'
    ) || false;
  };

  if (loadingMeds || loadingReminders || loadingIntakes) {
    return (
      <ScreenCard title="Calendario visual de tratamiento">
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Cargando calendario...</p>
        </div>
      </ScreenCard>
    );
  }

  const activeMedications = medicationsData?.medications?.filter(m => m.is_active) || [];
  const activeReminders = remindersData?.reminders?.filter(r => r.is_active) || [];

  return (
    <ScreenCard title="Calendario visual de tratamiento">
      <div className="space-y-6">
        {/* Week days */}
        <div className="flex justify-around">
          {weekDays.map((day, index) => {
            const dayCompleted = getDayStatus(day);
            const isCurrentDay = isToday(day);
            
            return (
              <div key={index} className="text-center">
                <div className={`text-sm font-medium mb-2 ${
                  isCurrentDay ? 'text-primary' : 'text-gray-600'
                }`}>
                  {format(day, 'EEE', { locale: es }).charAt(0).toUpperCase()}
                </div>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  dayCompleted 
                    ? 'bg-primary text-white' 
                    : isCurrentDay
                    ? 'bg-primary/20 text-primary border-2 border-primary'
                    : 'bg-gray-100 text-gray-400'
                }`}>
                  {dayCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <div className="text-xs font-bold">{format(day, 'd')}</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Today's Medications */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-700">Medicamentos de hoy</h3>
          
          {activeMedications.length === 0 ? (
            <div className="text-center py-8 text-gray-500 text-sm">
              No tienes medicamentos registrados
            </div>
          ) : (
            activeMedications.map((userMed) => {
              // Find reminders for this medication
              const medReminders = activeReminders.filter(
                r => r.user_medication_id === userMed.id
              );
              
              return (
                <div key={userMed.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-1 h-12 bg-primary rounded-full flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-900 text-sm truncate">
                      {userMed.custom_name || userMed.medication?.name}
                    </div>
                    <div className="text-xs text-gray-600">
                      {userMed.prescribed_dosage}
                    </div>
                    {medReminders.length > 0 && (
                      <div className="flex items-center mt-1 text-xs text-primary">
                        <Clock className="w-3 h-3 mr-1" />
                        {medReminders.map(r => r.reminder_time).join(', ')}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Active Reminders Summary */}
        {activeReminders.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              📅 Tienes {activeReminders.length} recordatorio{activeReminders.length > 1 ? 's' : ''} activo{activeReminders.length > 1 ? 's' : ''}
            </p>
          </div>
        )}
      </div>
    </ScreenCard>
  );
};
