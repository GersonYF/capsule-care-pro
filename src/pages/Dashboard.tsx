import { useState } from "react";
import { AlarmsNotifications } from "@/components/screens/AlarmsNotifications";
import { VisualCalendar } from "@/components/screens/VisualCalendar";
import { ConsumptionHistory } from "@/components/screens/ConsumptionHistory";
import { PrescriptionAlerts } from "@/components/screens/PrescriptionAlerts";
import { MedicationRegistry } from "@/components/screens/MedicationRegistry";
import { AdditionalFeatures } from "@/components/screens/AdditionalFeatures";
import { Home, Calendar, History, Bell, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";
import { useGetNotificationsQuery } from "@/store/api/notificationsApi";

const screens = [
  { id: 'home', component: MedicationRegistry, title: 'Inicio', icon: Home },
  { id: 'calendar', component: VisualCalendar, title: 'Calendario', icon: Calendar },
  { id: 'history', component: ConsumptionHistory, title: 'Historial', icon: History },
  { id: 'notifications', title: 'Alertas', icon: Bell, isExternal: true },
  { id: 'profile', title: 'Perfil', icon: User, isExternal: true },
];

export const Dashboard = () => {
  const [currentScreen, setCurrentScreen] = useState('home');
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);
  
  const { data: notifications } = useGetNotificationsQuery({
    page: 1,
    per_page: 5,
    unread_only: true,
  });
  
  const CurrentComponent = screens.find(s => s.id === currentScreen)?.component || MedicationRegistry;
  const unreadCount = notifications?.total || 0;

  const handleNavClick = (screenId: string, isExternal?: boolean) => {
    if (isExternal) {
      navigate(`/${screenId}`);
    } else {
      setCurrentScreen(screenId);
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex flex-col">
      {/* Top Header - Minimal */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-primary">CapsuleCare</h1>
          <p className="text-xs text-gray-500">{user?.username || 'Usuario'}</p>
        </div>
        {unreadCount > 0 && (
          <div className="bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <CurrentComponent />
      </div>

      {/* Bottom Navigation - Single source of truth */}
      <div className="bg-white border-t border-gray-200 px-2 py-2 safe-area-bottom">
        <div className="flex justify-around items-center max-w-md mx-auto">
          {screens.map((screen) => {
            const Icon = screen.icon;
            const isActive = screen.isExternal ? false : currentScreen === screen.id;
            
            return (
              <button
                key={screen.id}
                onClick={() => handleNavClick(screen.id, screen.isExternal)}
                className={`flex flex-col items-center justify-center min-w-[60px] py-2 px-3 rounded-lg transition-all ${
                  isActive
                    ? 'text-primary bg-primary/10'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <div className="relative">
                  <Icon className="w-6 h-6" />
                  {screen.id === 'notifications' && unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                      {unreadCount > 9 ? '9' : unreadCount}
                    </span>
                  )}
                </div>
                <span className="text-xs mt-1 font-medium">{screen.title}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
