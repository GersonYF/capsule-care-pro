import { useState } from "react";
import { AlarmsNotifications } from "@/components/screens/AlarmsNotifications";
import { VisualCalendar } from "@/components/screens/VisualCalendar";
import { ConsumptionHistory } from "@/components/screens/ConsumptionHistory";
import { PrescriptionAlerts } from "@/components/screens/PrescriptionAlerts";
import { MedicationRegistry } from "@/components/screens/MedicationRegistry";
import { AdditionalFeatures } from "@/components/screens/AdditionalFeatures";
import { Button } from "@/components/ui/button";

const screens = [
  { id: 'alarms', component: AlarmsNotifications, title: 'Alarmas' },
  { id: 'calendar', component: VisualCalendar, title: 'Calendario' },
  { id: 'history', component: ConsumptionHistory, title: 'Historial' },
  { id: 'alerts', component: PrescriptionAlerts, title: 'Alertas' },
  { id: 'registry', component: MedicationRegistry, title: 'Registro' },
  { id: 'features', component: AdditionalFeatures, title: 'Funciones' },
];

export const Dashboard = () => {
  const [currentScreen, setCurrentScreen] = useState(0);
  const CurrentComponent = screens[currentScreen].component;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/10 p-4">
      {/* Navigation */}
      <div className="max-w-6xl mx-auto mb-6">
        <div className="flex flex-wrap gap-2 justify-center">
          {screens.map((screen, index) => (
            <Button
              key={screen.id}
              variant={currentScreen === index ? "default" : "outline"}
              size="sm"
              onClick={() => setCurrentScreen(index)}
              className={currentScreen === index ? "bg-primary text-white" : ""}
            >
              {screen.title}
            </Button>
          ))}
        </div>
      </div>

      {/* Current Screen */}
      <div className="flex justify-center">
        <CurrentComponent />
      </div>
    </div>
  );
};