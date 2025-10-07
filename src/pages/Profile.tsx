import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetUserProfileQuery, useUpdateUserProfileMutation } from "@/store/api/usersApi";
import { useAppDispatch } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { User, Mail, Phone, Calendar, ArrowLeft, LogOut } from "lucide-react";

export const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { data: user, isLoading } = useGetUserProfileQuery();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateUserProfileMutation();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    phone: user?.phone || "",
    date_of_birth: user?.date_of_birth || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await updateProfile(formData).unwrap();
      toast({
        title: "Perfil actualizado",
        description: "Tu información ha sido guardada correctamente",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "No se pudo actualizar el perfil",
        variant: "destructive",
      });
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  if (isLoading) {
    return (
      <div className="h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <p className="text-gray-500">Cargando perfil...</p>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold text-gray-900">Mi Perfil</h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {/* Profile Summary */}
        <Card className="mb-4">
          <CardContent className="p-6 text-center">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <User className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">{user?.username}</h2>
            <p className="text-sm text-gray-600 mt-1">{user?.email}</p>
          </CardContent>
        </Card>

        {/* Edit Form */}
        <Card>
          <CardContent className="p-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="first_name" className="text-xs text-gray-700">Nombre</Label>
                  <Input
                    id="first_name"
                    value={formData.first_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, first_name: e.target.value }))}
                    placeholder="Tu nombre"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="last_name" className="text-xs text-gray-700">Apellido</Label>
                  <Input
                    id="last_name"
                    value={formData.last_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, last_name: e.target.value }))}
                    placeholder="Tu apellido"
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="phone" className="text-xs text-gray-700">Teléfono</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="+57 300 123 4567"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="date_of_birth" className="text-xs text-gray-700">Fecha de Nacimiento</Label>
                <Input
                  id="date_of_birth"
                  type="date"
                  value={formData.date_of_birth}
                  onChange={(e) => setFormData(prev => ({ ...prev, date_of_birth: e.target.value }))}
                  className="mt-1"
                />
              </div>

              <Button 
                type="submit" 
                disabled={isUpdating}
                className="w-full bg-primary hover:bg-primary/90 text-white"
              >
                {isUpdating ? "Guardando..." : "Guardar Cambios"}
              </Button>

              <Button 
                type="button"
                variant="outline"
                onClick={handleLogout}
                className="w-full text-red-600 border-red-200 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Cerrar Sesión
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
