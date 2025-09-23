import { ScreenCard } from "../ScreenCard";
import { Check, X } from "lucide-react";

export const ConsumptionHistory = () => {
  const weekDays = [true, true, true, true, false]; // completion status for each day

  return (
    <ScreenCard title="Historial de consumo">
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold mb-4">Esta semana</h2>
          <div className="flex space-x-3">
            {weekDays.map((completed, index) => (
              <div key={index} className={`w-10 h-10 rounded-full flex items-center justify-center ${
                completed 
                  ? 'bg-primary text-white' 
                  : 'bg-gray-200 text-gray-400'
              }`}>
                {completed ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <X className="w-5 h-5" />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-semibold">Ibuprofen</span>
            <span className="text-primary font-semibold">09:00</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">09:00</span>
            <span className="text-primary font-semibold">00</span>
          </div>
          
          <div className="flex items-center justify-between pt-2">
            <span className="font-semibold">Ayer</span>
            <span className="text-muted-foreground">09:00</span>
          </div>
        </div>
      </div>
    </ScreenCard>
  );
};