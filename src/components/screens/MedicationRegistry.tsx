import { useState } from "react";
import { ScreenCard } from "../ScreenCard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Camera, FileText, Upload, X, Sparkles, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAddUserMedicationMutation } from "@/store/api/medicationsApi";
import { useAnalyzePrescriptionMutation } from "@/store/api/aiApi";

const FREQUENCY_OPTIONS = [
  { value: "once_daily", label: "Una vez al día" },
  { value: "twice_daily", label: "Dos veces al día" },
  { value: "three_times_daily", label: "Tres veces al día" },
  { value: "four_times_daily", label: "Cuatro veces al día" },
  { value: "every_4_hours", label: "Cada 4 horas" },
  { value: "every_6_hours", label: "Cada 6 horas" },
  { value: "every_8_hours", label: "Cada 8 horas" },
  { value: "every_12_hours", label: "Cada 12 horas" },
  { value: "as_needed", label: "Según sea necesario" },
  { value: "weekly", label: "Una vez a la semana" },
  { value: "custom", label: "Personalizado" },
];

export const MedicationRegistry = () => {
  const { toast } = useToast();
  const [addUserMedication, { isLoading: isSaving }] = useAddUserMedicationMutation();
  const [analyzePrescription, { isLoading: isAnalyzing }] = useAnalyzePrescriptionMutation();
  
  const [activeTab, setActiveTab] = useState<'form' | 'photo'>('form');
  const [formData, setFormData] = useState({
    custom_name: "",
    prescribed_dosage: "",
    prescribed_frequency: "",
    custom_frequency: "",
    doctor_instructions: "",
    notes: "",
    start_date: new Date().toISOString().split('T')[0],
  });
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadedFile(file);

    // Automatically analyze the image
    const formData = new FormData();
    formData.append('image', file);

    try {
      const result = await analyzePrescription(formData).unwrap();
      
      // Auto-fill form with AI analysis
      setFormData(prev => ({
        ...prev,
        custom_name: result.analysis.name || prev.custom_name,
        prescribed_dosage: result.analysis.dosage || result.analysis.strength || prev.prescribed_dosage,
        prescribed_frequency: result.analysis.frequency || prev.prescribed_frequency,
        doctor_instructions: result.analysis.instructions || prev.doctor_instructions,
        notes: result.analysis.notes || prev.notes,
      }));

      // Switch to form tab to show results
      setActiveTab('form');

      toast({
        title: "¡Imagen analizada!",
        description: `Información extraída con ${result.confidence === 'high' ? 'alta' : 'media'} confianza. Verifica los datos.`,
      });
    } catch (err: any) {
      toast({
        title: "Error al analizar",
        description: err.data?.error || "No se pudo analizar la imagen. Completa el formulario manualmente.",
        variant: "destructive",
      });
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.custom_name || !formData.prescribed_dosage) {
      toast({
        title: "Información faltante",
        description: "Por favor completa el nombre y dosis del medicamento.",
        variant: "destructive"
      });
      return;
    }

    // Use custom frequency if "custom" is selected, otherwise use the selected preset
    const finalFrequency = formData.prescribed_frequency === "custom" 
      ? formData.custom_frequency 
      : FREQUENCY_OPTIONS.find(opt => opt.value === formData.prescribed_frequency)?.label || formData.prescribed_frequency;

    try {
      // Backend will automatically:
      // 1. Search for existing medication by name
      // 2. Create new medication if it doesn't exist
      // 3. Link medication to user
      await addUserMedication({
        custom_name: formData.custom_name,
        prescribed_dosage: formData.prescribed_dosage,
        prescribed_frequency: finalFrequency,
        doctor_instructions: formData.doctor_instructions,
        notes: formData.notes,
        start_date: formData.start_date,
      }).unwrap();

      toast({
        title: "¡Medicamento registrado!",
        description: `${formData.custom_name} se ha agregado correctamente.`,
      });

      // Reset form
      setFormData({
        custom_name: "",
        prescribed_dosage: "",
        prescribed_frequency: "",
        custom_frequency: "",
        doctor_instructions: "",
        notes: "",
        start_date: new Date().toISOString().split('T')[0],
      });
      setUploadedFile(null);
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.data?.error || "No se pudo registrar el medicamento",
        variant: "destructive",
      });
    }
  };

  return (
    <ScreenCard title="Registro de medicamentos">
      <div className="space-y-4">
        {/* Tab Navigation */}
        <div className="flex space-x-2 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('form')}
            className={`flex-1 flex items-center justify-center space-x-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'form' 
                ? 'bg-white text-primary shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Formulario</span>
          </button>
          <button
            onClick={() => setActiveTab('photo')}
            className={`flex-1 flex items-center justify-center space-x-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'photo' 
                ? 'bg-white text-primary shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>Foto con IA</span>
          </button>
        </div>

        {/* Form Tab */}
        {activeTab === 'form' && (
          <form onSubmit={handleFormSubmit} className="space-y-3">
            <div>
              <Label className="text-gray-700 font-medium text-sm">Nombre del Medicamento *</Label>
              <Input
                value={formData.custom_name}
                onChange={(e) => setFormData(prev => ({ ...prev, custom_name: e.target.value }))}
                placeholder="ej., Ibuprofeno"
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label className="text-gray-700 font-medium text-sm">Dosis *</Label>
              <Input
                value={formData.prescribed_dosage}
                onChange={(e) => setFormData(prev => ({ ...prev, prescribed_dosage: e.target.value }))}
                placeholder="ej., 400 mg"
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label className="text-gray-700 font-medium text-sm">Frecuencia</Label>
              <Select
                value={formData.prescribed_frequency}
                onValueChange={(value) => setFormData(prev => ({ ...prev, prescribed_frequency: value }))}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Selecciona la frecuencia" />
                </SelectTrigger>
                <SelectContent>
                  {FREQUENCY_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Show custom frequency input if "custom" is selected */}
            {formData.prescribed_frequency === "custom" && (
              <div>
                <Label className="text-gray-700 font-medium text-sm">Frecuencia Personalizada</Label>
                <Input
                  value={formData.custom_frequency}
                  onChange={(e) => setFormData(prev => ({ ...prev, custom_frequency: e.target.value }))}
                  placeholder="ej., Cada 3 días con comida"
                  className="mt-1"
                />
              </div>
            )}

            <div>
              <Label className="text-gray-700 font-medium text-sm">Fecha de Inicio</Label>
              <Input
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
                className="mt-1"
              />
            </div>

            <div>
              <Label className="text-gray-700 font-medium text-sm">Instrucciones del Médico</Label>
              <Textarea
                value={formData.doctor_instructions}
                onChange={(e) => setFormData(prev => ({ ...prev, doctor_instructions: e.target.value }))}
                placeholder="ej., Tomar con alimentos"
                rows={2}
                className="mt-1"
              />
            </div>

            <div>
              <Label className="text-gray-700 font-medium text-sm">Notas Adicionales</Label>
              <Textarea
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Notas adicionales..."
                rows={2}
                className="mt-1"
              />
            </div>

            <Button 
              type="submit" 
              disabled={isSaving}
              className="w-full bg-primary hover:bg-primary/90 text-white rounded-xl h-11 text-base font-medium"
            >
              {isSaving ? "Guardando..." : "Guardar Medicamento"}
            </Button>
          </form>
        )}

        {/* Photo Upload Tab with AI */}
        {activeTab === 'photo' && (
          <div className="space-y-4">
            <div className="border-2 border-dashed border-primary/30 rounded-lg p-8 text-center bg-gradient-to-br from-blue-50 to-purple-50">
              {isAnalyzing ? (
                <div className="space-y-3">
                  <Loader2 className="w-12 h-12 text-primary mx-auto animate-spin" />
                  <p className="text-sm text-primary font-medium">
                    Analizando receta con IA...
                  </p>
                </div>
              ) : uploadedFile ? (
                <div className="space-y-3">
                  <div className="w-20 h-20 mx-auto bg-primary/10 rounded-lg flex items-center justify-center">
                    <Camera className="w-8 h-8 text-primary" />
                  </div>
                  <p className="text-sm text-gray-600">{uploadedFile.name}</p>
                  <p className="text-xs text-green-600 font-medium">✓ Información extraída</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setUploadedFile(null)}
                  >
                    <X className="w-4 h-4 mr-1" />
                    Subir otra imagen
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="relative inline-block">
                    <Camera className="w-12 h-12 text-primary mx-auto" />
                    <Sparkles className="w-5 h-5 text-purple-500 absolute -top-1 -right-1" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 mb-1">
                      Análisis con Inteligencia Artificial
                    </p>
                    <p className="text-xs text-gray-600 mb-3">
                      Sube una foto de tu receta y la IA extraerá la información automáticamente
                    </p>
                    <label className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg cursor-pointer hover:bg-primary/90 transition-colors">
                      <Upload className="w-4 h-4 mr-2" />
                      Subir Receta
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                        disabled={isAnalyzing}
                      />
                    </label>
                  </div>
                </div>
              )}
            </div>
            
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-primary/20 rounded-lg p-3">
              <div className="flex items-start space-x-2">
                <Sparkles className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <div className="text-xs text-gray-700">
                  <p className="font-semibold text-primary mb-1">Powered by OpenAI GPT-4 Vision</p>
                  <p>La IA identificará automáticamente: nombre del medicamento, dosis, frecuencia e instrucciones. Siempre verifica la información extraída.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ScreenCard>
  );
};
