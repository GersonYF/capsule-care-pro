import { ScreenCard } from "../ScreenCard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const MedicationRegistry = () => {
  return (
    <ScreenCard title="Registro de información de medicamentos">
      <div className="space-y-6">
        {/* Photo section */}
        <div>
          <Label className="text-lg font-semibold">Foto</Label>
          <div className="mt-2 flex justify-center">
            <div className="relative">
              <div className="w-16 h-4 bg-primary rounded-sm" />
              <div className="w-12 h-4 bg-primary/70 rounded-sm mt-1 ml-2" />
              <div className="w-8 h-4 bg-primary/40 rounded-sm mt-1 ml-4" />
            </div>
          </div>
        </div>

        {/* Form fields */}
        <div className="space-y-4">
          <div>
            <Label className="text-primary text-lg font-medium">Nombre</Label>
            <div className="mt-1 text-lg font-semibold">Ibuprofen</div>
          </div>
          
          <div>
            <Label className="text-primary text-lg font-medium">Dosis</Label>
            <div className="mt-1 text-lg font-semibold">400 mg</div>
          </div>
        </div>
      </div>
    </ScreenCard>
  );
};