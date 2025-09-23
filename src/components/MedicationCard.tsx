import { Check, Clock, Pill, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Medication, MedicationDose } from "@/types/medication";

interface MedicationCardProps {
  medication: Medication;
  dose: MedicationDose;
  onMarkTaken: (doseId: string) => void;
  onMarkSkipped: (doseId: string) => void;
}

export const MedicationCard = ({ medication, dose, onMarkTaken, onMarkSkipped }: MedicationCardProps) => {
  const isOverdue = new Date() > new Date(`${dose.date.toDateString()} ${dose.scheduledTime}`);
  
  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div 
              className="w-4 h-8 rounded-full flex-shrink-0"
              style={{ backgroundColor: medication.color }}
            />
            <div className="flex-1">
              <h3 className="font-semibold text-card-foreground">{medication.name}</h3>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>{dose.scheduledTime}</span>
                <Badge variant="outline" className="text-xs">
                  {medication.dosage}
                </Badge>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {dose.taken ? (
              <Badge variant="secondary" className="bg-success text-success-foreground">
                <Check className="w-3 h-3 mr-1" />
                Taken
              </Badge>
            ) : dose.skipped ? (
              <Badge variant="secondary" className="bg-muted text-muted-foreground">
                <X className="w-3 h-3 mr-1" />
                Skipped
              </Badge>
            ) : (
              <div className="flex space-x-1">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onMarkSkipped(dose.id)}
                  className="h-8 px-3"
                >
                  <X className="w-3 h-3" />
                </Button>
                <Button
                  size="sm"
                  onClick={() => onMarkTaken(dose.id)}
                  className="h-8 px-3 bg-primary hover:bg-primary/90"
                >
                  <Check className="w-3 h-3 mr-1" />
                  Take
                </Button>
              </div>
            )}
          </div>
        </div>
        
        {isOverdue && !dose.taken && !dose.skipped && (
          <div className="mt-2 text-sm text-warning flex items-center">
            <Clock className="w-3 h-3 mr-1" />
            Overdue
          </div>
        )}
      </CardContent>
    </Card>
  );
};