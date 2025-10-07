import { useGetRemindersQuery, useUpdateReminderMutation, useDeleteReminderMutation } from "@/store/api/remindersApi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Bell, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

export const RemindersList = () => {
  const { data, isLoading } = useGetRemindersQuery();
  const [updateReminder] = useUpdateReminderMutation();
  const [deleteReminder] = useDeleteReminderMutation();
  const { toast } = useToast();

  const handleToggleActive = async (reminder: any) => {
    try {
      // Send only the id and is_active fields
      await updateReminder({ 
        id: reminder.id, 
        is_active: !reminder.is_active 
      }).unwrap();
      
      toast({
        title: reminder.is_active ? "Recordatorio desactivado" : "Recordatorio activado",
        description: `${reminder.title || 'Recordatorio'} ha sido ${reminder.is_active ? 'desactivado' : 'activado'}`,
      });
    } catch (err: any) {
      console.error('Error updating reminder:', err);
      toast({
        title: "Error",
        description: err.data?.error || "No se pudo actualizar el recordatorio",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: number, title: string) => {
    if (window.confirm(`¿Eliminar recordatorio "${title}"?`)) {
      try {
        await deleteReminder(id).unwrap();
        toast({
          title: "Recordatorio eliminado",
          description: `${title} ha sido eliminado`,
        });
      } catch (err: any) {
        toast({
          title: "Error",
          description: err.data?.error || "No se pudo eliminar el recordatorio",
          variant: "destructive",
        });
      }
    }
  };

  if (isLoading) {
    return <div className="text-center py-8 text-gray-500">Cargando recordatorios...</div>;
  }

  if (!data?.reminders || data.reminders.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Bell className="w-16 h-16 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay recordatorios</h3>
          <p className="text-gray-600 text-center">
            Crea tu primer recordatorio para no olvidar tus medicamentos
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {data.reminders.map((reminder) => (
        <Card key={reminder.id} className={reminder.is_active ? 'border-primary/50' : 'opacity-60'}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <CardTitle className="text-lg text-gray-900">
                    {reminder.title || 'Recordatorio'}
                  </CardTitle>
                  <Badge variant={reminder.is_active ? 'default' : 'secondary'}>
                    {reminder.is_active ? 'Activo' : 'Inactivo'}
                  </Badge>
                </div>
                <CardDescription className="mt-1">
                  {reminder.medication?.name || 'Medicamento no especificado'}
                </CardDescription>
              </div>
              <Switch
                checked={reminder.is_active}
                onCheckedChange={() => handleToggleActive(reminder)}
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-700">
                <Clock className="w-4 h-4 mr-2 text-primary" />
                <span className="font-medium">Hora:</span>
                <span className="ml-2">{reminder.reminder_time || 'No especificada'}</span>
              </div>
              
              <div className="flex items-center text-sm text-gray-700">
                <Bell className="w-4 h-4 mr-2 text-primary" />
                <span className="font-medium">Frecuencia:</span>
                <span className="ml-2 capitalize">{reminder.frequency_type}</span>
              </div>

              {reminder.description && (
                <p className="text-sm text-gray-600 mt-2 p-2 bg-gray-50 rounded">
                  {reminder.description}
                </p>
              )}

              <div className="flex space-x-2 mt-4 pt-4 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={() => handleDelete(reminder.id, reminder.title || 'Recordatorio')}
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Eliminar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};