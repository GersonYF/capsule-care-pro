import { useState } from "react";
import { Plus, Pill } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Medication } from "@/types/medication";

interface AddMedicationDialogProps {
  onAddMedication: (medication: Omit<Medication, 'id'>) => void;
}

const medicationColors = [
  "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7", "#DDA0DD", "#98D8C8"
];

export const AddMedicationDialog = ({ onAddMedication }: AddMedicationDialogProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    dosage: "",
    frequency: 1,
    times: ["09:00"],
    color: medicationColors[0],
    notes: "",
    reminderEnabled: true,
    soundEnabled: true,
    vibrationEnabled: true,
    notificationEnabled: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddMedication({
      ...formData,
      startDate: new Date(),
    });
    setOpen(false);
    setFormData({
      name: "",
      dosage: "",
      frequency: 1,
      times: ["09:00"],
      color: medicationColors[0],
      notes: "",
      reminderEnabled: true,
      soundEnabled: true,
      vibrationEnabled: true,
      notificationEnabled: true,
    });
  };

  const updateTimes = (frequency: number) => {
    const times = [];
    for (let i = 0; i < frequency; i++) {
      const hour = 9 + (i * 12 / frequency);
      times.push(`${Math.floor(hour).toString().padStart(2, '0')}:00`);
    }
    setFormData(prev => ({ ...prev, frequency, times }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          Add Medication
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Pill className="w-5 h-5 text-primary" />
            <span>Add New Medication</span>
          </DialogTitle>
          <DialogDescription>
            Add a new medication to your daily schedule with reminders.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Medication Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., Ibuprofen"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="dosage">Dosage</Label>
            <Input
              id="dosage"
              value={formData.dosage}
              onChange={(e) => setFormData(prev => ({ ...prev, dosage: e.target.value }))}
              placeholder="e.g., 400 mg"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="frequency">Times per day</Label>
            <select
              id="frequency"
              value={formData.frequency}
              onChange={(e) => updateTimes(Number(e.target.value))}
              className="w-full p-2 border border-input rounded-md bg-background"
            >
              <option value={1}>Once daily</option>
              <option value={2}>Twice daily</option>
              <option value={3}>Three times daily</option>
              <option value={4}>Four times daily</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <Label>Times</Label>
            <div className="flex flex-wrap gap-2">
              {formData.times.map((time, index) => (
                <input
                  key={index}
                  type="time"
                  value={time}
                  onChange={(e) => {
                    const newTimes = [...formData.times];
                    newTimes[index] = e.target.value;
                    setFormData(prev => ({ ...prev, times: newTimes }));
                  }}
                  className="p-1 border border-input rounded text-sm"
                />
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Color</Label>
            <div className="flex space-x-2">
              {medicationColors.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`w-8 h-8 rounded-full border-2 ${
                    formData.color === color ? 'border-primary' : 'border-border'
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => setFormData(prev => ({ ...prev, color }))}
                />
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Additional notes about this medication..."
              rows={2}
            />
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary/90">
              Add Medication
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};