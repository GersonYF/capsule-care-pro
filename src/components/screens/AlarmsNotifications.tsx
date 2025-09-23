import { ScreenCard } from "../ScreenCard";
import { ToggleSwitch } from "../ToggleSwitch";
import { Button } from "@/components/ui/button";

export const AlarmsNotifications = () => {
  return (
    <ScreenCard title="Alarmas y notificaciones">
      <div className="space-y-1">
        <ToggleSwitch label="Sonido" defaultChecked={true} />
        <ToggleSwitch label="Vibracion" defaultChecked={true} />
        <ToggleSwitch label="Notificacion" defaultChecked={true} />
      </div>
      
      <div className="mt-6 flex items-center space-x-3">
        <div className="w-4 h-8 bg-primary rounded-full flex-shrink-0" />
        <span className="font-semibold text-lg">Ibuprofen</span>
      </div>
      
      <div className="mt-auto">
        <Button className="w-full bg-primary hover:bg-primary/90 text-white rounded-xl h-12 text-lg font-medium">
          
        </Button>
      </div>
    </ScreenCard>
  );
};