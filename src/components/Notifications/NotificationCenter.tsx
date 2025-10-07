import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useGetNotificationsQuery,
  useMarkNotificationAsReadMutation,
  useMarkAllNotificationsAsReadMutation,
} from "@/store/api/notificationsApi";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Bell, Check, CheckCheck, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export const NotificationCenter = () => {
  const navigate = useNavigate();
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const { toast } = useToast();
  
  const { data, isLoading } = useGetNotificationsQuery({
    page: 1,
    per_page: 20,
    unread_only: showUnreadOnly,
  });
  
  const [markAsRead] = useMarkNotificationAsReadMutation();
  const [markAllAsRead] = useMarkAllNotificationsAsReadMutation();

  const handleMarkAsRead = async (id: number) => {
    try {
      await markAsRead(id).unwrap();
    } catch (err) {
      toast({
        title: "Error",
        description: "No se pudo marcar como leída",
        variant: "destructive",
      });
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead().unwrap();
      toast({
        title: "Listo",
        description: "Todas las notificaciones marcadas como leídas",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "No se pudieron marcar todas como leídas",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-900">Notificaciones</h1>
            <p className="text-xs text-gray-500">
              {data?.total || 0} {showUnreadOnly ? 'sin leer' : 'totales'}
            </p>
          </div>
        </div>
        
        <div className="flex space-x-2 mt-3">
          <Button
            variant={showUnreadOnly ? "default" : "outline"}
            size="sm"
            onClick={() => setShowUnreadOnly(!showUnreadOnly)}
            className="text-xs"
          >
            {showUnreadOnly ? 'Ver todas' : 'Solo sin leer'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleMarkAllAsRead}
            className="text-xs"
          >
            <CheckCheck className="w-3 h-3 mr-1" />
            Marcar todas
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Cargando notificaciones...</p>
          </div>
        ) : !data?.notifications || data.notifications.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Bell className="w-16 h-16 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No hay notificaciones
              </h3>
              <p className="text-gray-600 text-center text-sm">
                {showUnreadOnly 
                  ? 'No tienes notificaciones sin leer' 
                  : 'No tienes notificaciones todavía'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {data.notifications.map((notification) => (
              <Card
                key={notification.id}
                className={`transition-all ${
                  notification.read_at ? 'bg-white' : 'bg-blue-50 border-primary/30'
                }`}
                onClick={() => !notification.read_at && handleMarkAsRead(notification.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                      notification.read_at ? 'bg-gray-300' : 'bg-primary'
                    }`} />
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold text-gray-900 text-sm">
                          {notification.title}
                        </h3>
                        <span className="text-xs text-gray-500 whitespace-nowrap">
                          {notification.created_at 
                            ? format(new Date(notification.created_at), 'dd MMM, HH:mm', { locale: es })
                            : ''}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-600 mt-1">
                        {notification.message}
                      </p>
                      
                      {!notification.read_at && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="mt-2 text-primary hover:text-primary/80 text-xs h-7"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMarkAsRead(notification.id);
                          }}
                        >
                          <Check className="w-3 h-3 mr-1" />
                          Marcar como leída
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
