import { ScreenCard } from "../ScreenCard";
import { Button } from "@/components/ui/button";

export const PrescriptionAlerts = () => {
  return (
    <ScreenCard title="Alertas de renovación de receta">
      <div className="space-y-6">
        {/* Medication icon stack */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="w-16 h-4 bg-primary rounded-sm" />
            <div className="w-12 h-4 bg-primary/70 rounded-sm mt-1 ml-2" />
            <div className="w-8 h-4 bg-primary/40 rounded-sm mt-1 ml-4" />
          </div>
        </div>

        <div className="text-center space-y-2">
          <h2 className="text-xl font-bold">Ibuprofen</h2>
          <p className="text-muted-foreground">
            Renovar receta antes<br />
            25/04/2024
          </p>
        </div>
      </div>

      <div className="mt-auto">
        <Button className="w-full bg-primary hover:bg-primary/90 text-white rounded-xl h-12 text-lg font-medium">
          Aceptar
        </Button>
      </div>
    </ScreenCard>
  );
};