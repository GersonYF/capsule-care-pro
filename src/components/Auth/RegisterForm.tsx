import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRegisterMutation } from "@/store/api/authApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export const RegisterForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [register, { isLoading }] = useRegisterMutation();
  
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Las contraseñas no coinciden",
        variant: "destructive",
      });
      return;
    }

    try {
      await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      }).unwrap();
      
      toast({
        title: "¡Registro exitoso!",
        description: "Ahora puedes iniciar sesión",
      });
      navigate("/login");
    } catch (err: any) {
      toast({
        title: "Error de registro",
        description: err.data?.error || "No se pudo completar el registro",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-2xl shadow-lg">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-primary">Crear Cuenta</h1>
        <p className="text-gray-600 mt-2">Únete a CapsuleCare</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="username" className="text-gray-700">Usuario</Label>
          <Input
            id="username"
            type="text"
            value={formData.username}
            onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
            placeholder="Elige un usuario"
            required
          />
        </div>

        <div>
          <Label htmlFor="email" className="text-gray-700">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            placeholder="tu@email.com"
            required
          />
        </div>

        <div>
          <Label htmlFor="password" className="text-gray-700">Contraseña</Label>
          <Input
            id="password"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
            placeholder="Crea una contraseña"
            required
          />
        </div>

        <div>
          <Label htmlFor="confirmPassword" className="text-gray-700">Confirmar Contraseña</Label>
          <Input
            id="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
            placeholder="Confirma tu contraseña"
            required
          />
        </div>

        <Button 
          type="submit" 
          disabled={isLoading}
          className="w-full bg-primary hover:bg-primary-dark text-white rounded-xl h-12 text-lg font-medium"
        >
          {isLoading ? "Registrando..." : "Registrarse"}
        </Button>

        <div className="text-center">
          <Button
            type="button"
            variant="link"
            className="text-primary"
            onClick={() => navigate("/login")}
          >
            ¿Ya tienes cuenta? Inicia sesión
          </Button>
        </div>
      </form>
    </div>
  );
};
