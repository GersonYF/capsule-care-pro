import { useState } from "react";
import { ScreenCard } from "../ScreenCard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Camera, Mic, FileText, Upload, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const MedicationRegistry = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'photo' | 'audio' | 'form'>('photo');
  const [formData, setFormData] = useState({
    name: "",
    dosage: "",
    frequency: "",
    instructions: "",
    notes: ""
  });
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, type: 'photo' | 'audio') => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      toast({
        title: `${type === 'photo' ? 'Photo' : 'Audio'} uploaded!`,
        description: `${file.name} has been uploaded successfully.`,
      });
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.dosage) {
      toast({
        title: "Missing information",
        description: "Please fill in at least the medication name and dosage.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Medication registered!",
      description: `${formData.name} has been added to your medications.`,
    });
  };

  return (
    <ScreenCard title="Registro de información de medicamentos">
      <div className="space-y-4">
        {/* Tab Navigation */}
        <div className="flex space-x-2 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('photo')}
            className={`flex-1 flex items-center justify-center space-x-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'photo' 
                ? 'bg-white text-primary shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>Foto</span>
          </button>
          <button
            onClick={() => setActiveTab('audio')}
            className={`flex-1 flex items-center justify-center space-x-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'audio' 
                ? 'bg-white text-primary shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Mic className="w-4 h-4" />
            <span>Audio</span>
          </button>
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
        </div>

        {/* Photo Upload Tab */}
        {activeTab === 'photo' && (
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              {uploadedFile && uploadedFile.type.startsWith('image/') ? (
                <div className="space-y-3">
                  <div className="w-20 h-20 mx-auto bg-primary/10 rounded-lg flex items-center justify-center">
                    <Camera className="w-8 h-8 text-primary" />
                  </div>
                  <p className="text-sm text-gray-600">{uploadedFile.name}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setUploadedFile(null)}
                  >
                    <X className="w-4 h-4 mr-1" />
                    Remove
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <Camera className="w-12 h-12 text-gray-400 mx-auto" />
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Upload a photo of your medication</p>
                    <label className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg cursor-pointer hover:bg-primary/90">
                      <Upload className="w-4 h-4 mr-2" />
                      Choose Photo
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'photo')}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              )}
            </div>
            
            {uploadedFile && (
              <div className="space-y-3">
                <Label className="text-primary text-lg font-medium">Nombre</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter medication name..."
                  className="text-lg"
                />
                <Label className="text-primary text-lg font-medium">Dosis</Label>
                <Input
                  value={formData.dosage}
                  onChange={(e) => setFormData(prev => ({ ...prev, dosage: e.target.value }))}
                  placeholder="e.g., 400 mg"
                  className="text-lg"
                />
              </div>
            )}
          </div>
        )}

        {/* Audio Upload Tab */}
        {activeTab === 'audio' && (
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              {uploadedFile && uploadedFile.type.startsWith('audio/') ? (
                <div className="space-y-3">
                  <div className="w-20 h-20 mx-auto bg-primary/10 rounded-lg flex items-center justify-center">
                    <Mic className="w-8 h-8 text-primary" />
                  </div>
                  <p className="text-sm text-gray-600">{uploadedFile.name}</p>
                  <audio controls className="w-full">
                    <source src={URL.createObjectURL(uploadedFile)} type={uploadedFile.type} />
                    Your browser does not support the audio element.
                  </audio>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setUploadedFile(null)}
                  >
                    <X className="w-4 h-4 mr-1" />
                    Remove
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <Mic className="w-12 h-12 text-gray-400 mx-auto" />
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Upload audio instructions from your doctor</p>
                    <label className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg cursor-pointer hover:bg-primary/90">
                      <Upload className="w-4 h-4 mr-2" />
                      Choose Audio
                      <input
                        type="file"
                        accept="audio/*"
                        onChange={(e) => handleFileUpload(e, 'audio')}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              )}
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-800">
                💡 Tip: Record your doctor's instructions or medication details for easy reference
              </p>
            </div>
          </div>
        )}

        {/* Form Tab */}
        {activeTab === 'form' && (
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div>
              <Label className="text-primary font-medium">Medication Name *</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Ibuprofen"
                required
              />
            </div>

            <div>
              <Label className="text-primary font-medium">Dosage *</Label>
              <Input
                value={formData.dosage}
                onChange={(e) => setFormData(prev => ({ ...prev, dosage: e.target.value }))}
                placeholder="e.g., 400 mg"
                required
              />
            </div>

            <div>
              <Label className="text-primary font-medium">Frequency</Label>
              <Input
                value={formData.frequency}
                onChange={(e) => setFormData(prev => ({ ...prev, frequency: e.target.value }))}
                placeholder="e.g., Twice daily"
              />
            </div>

            <div>
              <Label className="text-primary font-medium">Instructions</Label>
              <Textarea
                value={formData.instructions}
                onChange={(e) => setFormData(prev => ({ ...prev, instructions: e.target.value }))}
                placeholder="e.g., Take with food"
                rows={2}
              />
            </div>

            <div>
              <Label className="text-primary font-medium">Notes</Label>
              <Textarea
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Additional notes..."
                rows={2}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-primary hover:bg-primary/90 text-white rounded-xl h-12 text-lg font-medium"
            >
              Save Medication
            </Button>
          </form>
        )}
      </div>
    </ScreenCard>
  );
};