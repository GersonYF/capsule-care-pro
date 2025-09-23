import { ScreenCard } from "../ScreenCard";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export const VisualCalendar = () => {
  const days = ['L', 'X', 'M', 'J', 'V'];
  const dayStates = [true, true, true, false, false]; // checkmarks for completed days

  return (
    <ScreenCard title="Calendario visual de tratamiento">
      <div className="space-y-6">
        {/* Week days */}
        <div className="flex justify-center space-x-8">
          {days.map((day, index) => (
            <div key={day} className="text-center">
              <div className="text-primary font-medium text-lg mb-2">{day}</div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                dayStates[index] 
                  ? 'bg-primary text-white' 
                  : 'bg-primary/20 text-primary'
              }`}>
                {dayStates[index] ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <div className="w-3 h-3 rounded-full bg-primary" />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Medication info */}
        <div className="flex items-center space-x-3">
          <div className="w-4 h-8 bg-primary rounded-full flex-shrink-0" />
          <div>
            <div className="font-semibold text-lg">Ibuprofen</div>
            <div className="text-sm text-muted-foreground">• 09:00</div>
          </div>
        </div>
      </div>

      <div className="mt-auto">
        <Button className="w-full bg-primary hover:bg-primary/90 text-white rounded-xl h-12 text-lg font-medium">
          
        </Button>
      </div>
    </ScreenCard>
  );
};