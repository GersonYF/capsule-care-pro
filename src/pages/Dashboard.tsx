import { useState, useEffect } from "react";
import { Bell, Calendar, Home, Plus, Settings, Pill } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MedicationCard } from "@/components/MedicationCard";
import { AddMedicationDialog } from "@/components/AddMedicationDialog";
import { Medication, MedicationDose } from "@/types/medication";
import { useToast } from "@/hooks/use-toast";

export const Dashboard = () => {
  const { toast } = useToast();
  const [medications, setMedications] = useState<Medication[]>([]);
  const [todayDoses, setTodayDoses] = useState<MedicationDose[]>([]);

  // Generate today's doses based on medications
  useEffect(() => {
    const today = new Date();
    const doses: MedicationDose[] = [];
    
    medications.forEach(medication => {
      medication.times.forEach(time => {
        doses.push({
          id: `${medication.id}-${time}-${today.toDateString()}`,
          medicationId: medication.id,
          scheduledTime: time,
          date: today,
          taken: false,
          skipped: false,
        });
      });
    });
    
    setTodayDoses(doses);
  }, [medications]);

  const handleAddMedication = (medicationData: Omit<Medication, 'id'>) => {
    const newMedication: Medication = {
      ...medicationData,
      id: Date.now().toString(),
    };
    setMedications(prev => [...prev, newMedication]);
    toast({
      title: "Medication added!",
      description: `${medicationData.name} has been added to your schedule.`,
    });
  };

  const handleMarkTaken = (doseId: string) => {
    setTodayDoses(prev => prev.map(dose => 
      dose.id === doseId 
        ? { ...dose, taken: true, takenAt: new Date(), skipped: false }
        : dose
    ));
    toast({
      title: "Medication taken!",
      description: "Great job staying on track with your medication.",
    });
  };

  const handleMarkSkipped = (doseId: string) => {
    setTodayDoses(prev => prev.map(dose => 
      dose.id === doseId 
        ? { ...dose, skipped: true, taken: false }
        : dose
    ));
  };

  const todayStats = {
    total: todayDoses.length,
    taken: todayDoses.filter(d => d.taken).length,
    remaining: todayDoses.filter(d => !d.taken && !d.skipped).length,
  };

  const completionRate = todayStats.total > 0 ? Math.round((todayStats.taken / todayStats.total) * 100) : 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border p-4">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-card-foreground">MedReminder</h1>
            <p className="text-sm text-muted-foreground">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </header>

      <div className="max-w-md mx-auto p-4 space-y-6">
        {/* Today's Progress */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center space-x-2">
              <Pill className="w-5 h-5 text-primary" />
              <span>Today's Progress</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div className="text-2xl font-bold text-primary">
                {completionRate}%
              </div>
              <div className="text-right text-sm text-muted-foreground">
                <div>{todayStats.taken} of {todayStats.total} taken</div>
                <div>{todayStats.remaining} remaining</div>
              </div>
            </div>
            <div className="w-full bg-secondary rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${completionRate}%` }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Today's Schedule */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Today's Schedule</h2>
            <Badge variant="outline">
              {todayStats.remaining} pending
            </Badge>
          </div>
          
          {todayDoses.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <Pill className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground mb-4">No medications scheduled for today</p>
                <AddMedicationDialog onAddMedication={handleAddMedication} />
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {todayDoses
                .sort((a, b) => a.scheduledTime.localeCompare(b.scheduledTime))
                .map(dose => {
                  const medication = medications.find(m => m.id === dose.medicationId);
                  if (!medication) return null;
                  
                  return (
                    <MedicationCard
                      key={dose.id}
                      medication={medication}
                      dose={dose}
                      onMarkTaken={handleMarkTaken}
                      onMarkSkipped={handleMarkSkipped}
                    />
                  );
                })}
              
              <div className="pt-4">
                <AddMedicationDialog onAddMedication={handleAddMedication} />
              </div>
            </div>
          )}
        </div>

        {/* Congratulations message */}
        {completionRate === 100 && todayStats.total > 0 && (
          <Card className="bg-success/10 border-success/20">
            <CardContent className="p-4 text-center">
              <div className="text-4xl mb-2">🎉</div>
              <h3 className="font-semibold text-success mb-1">¡Bien hecho!</h3>
              <p className="text-sm text-success/80">
                You've taken all your medications today!
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
        <div className="max-w-md mx-auto flex items-center justify-around py-2">
          <Button variant="ghost" size="sm" className="flex-1 text-primary">
            <Home className="w-5 h-5 mb-1" />
            <span className="text-xs">Home</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex-1">
            <Calendar className="w-5 h-5 mb-1" />
            <span className="text-xs">Calendar</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex-1">
            <Bell className="w-5 h-5 mb-1" />
            <span className="text-xs">History</span>
          </Button>
        </div>
      </nav>
    </div>
  );
};