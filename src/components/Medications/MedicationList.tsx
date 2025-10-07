import { useGetUserMedicationsQuery, useDeleteUserMedicationMutation } from "@/store/api/medicationsApi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Edit, Pill } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const MedicationList = () => {
  const { data, isLoading } = useGetUserMedicationsQuery();
  const [deleteMedication] = useDeleteUserMedicationMutation();
  const { toast } = useToast();

  const handleDelete = async (id: number, name: string) => {
    if (window.confirm(`¿Estás seguro de eliminar ${name}?`)) {
      try {
        await deleteMedication(id).unwrap();
        toast({
          title: "Medicamento eliminado",
          description: `${name} ha sido eliminado correctamente.`,
        });
      } catch (err) {
        toast({
          title: "Error",
          description: "No se pudo eliminar el medicamento",
          variant: "destructive",
        });
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Cargando medicamentos...</p>
      </div>
    );
  }

  if (!data?.medications || data.medications.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Pill className="w-16 h-16 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay medicamentos</h3>
          <p className="text-gray-600 text-center mb-4">
            Comienza agregando tu primer medicamento
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {data.medications.map((userMed) => (
        <Card key={userMed.id} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-10 bg-primary rounded-full" />
                <div>
                  <CardTitle className="text-lg text-gray-900">
                    {userMed.custom_name || userMed.medication?.name}
                  </CardTitle>
                  <CardDescription className="text-sm">
                    {userMed.prescribed_dosage}
                  </CardDescription>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              {userMed.prescribed_frequency && (
                <p className="text-gray-700">
                  <span className="font-medium">Frecuencia:</span> {userMed.prescribed_frequency}
                </p>
              )}
              {userMed.start_date && (
                <p className="text-gray-700">
                  <span className="font-medium">Inicio:</span> {new Date(userMed.start_date).toLocaleDateString()}
                </p>
              )}
              {userMed.doctor_instructions && (
                <p className="text-gray-600 text-xs mt-2 p-2 bg-blue-50 rounded">
                  {userMed.doctor_instructions}
                </p>
              )}
            </div>
            
            <div className="flex space-x-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => {/* Navigate to edit */}}
              >
                <Edit className="w-4 h-4 mr-1" />
                Editar
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={() => handleDelete(userMed.id, userMed.custom_name || userMed.medication?.name || 'Medicamento')}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
