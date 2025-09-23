import { ScreenCard } from "../ScreenCard";
import { Button } from "@/components/ui/button";

export const AdditionalFeatures = () => {
  return (
    <ScreenCard title="Funciones adicionales opcionales">
      <div className="flex flex-col items-center justify-center space-y-6 h-full">
        {/* Success icon */}
        <div className="relative">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
            <div className="w-8 h-8 bg-white/20 rounded-full" />
          </div>
          {/* Radiating lines */}
          <div className="absolute -inset-4">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-4 bg-primary rounded-full"
                style={{
                  transform: `rotate(${i * 45}deg)`,
                  transformOrigin: '50% 200%',
                  top: '50%',
                  left: '50%',
                  marginLeft: '-2px',
                  marginTop: '-16px',
                }}
              />
            ))}
          </div>
        </div>

        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold">¡Bien hecho!</h2>
          <p className="text-lg">
            Tomaste todos los<br />
            medicamentos hoy!!
          </p>
        </div>

        <Button className="w-full bg-primary hover:bg-primary/90 text-white rounded-xl h-12 text-lg font-medium">
          Compartir
        </Button>
      </div>
    </ScreenCard>
  );
};