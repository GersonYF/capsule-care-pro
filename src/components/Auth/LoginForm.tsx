import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "@/store/api/authApi";
import { useAppDispatch } from "@/store/hooks";
import { setCredentials } from "@/store/slices/authSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export const LoginForm = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const [login, { isLoading }] = useLoginMutation();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const result = await login(formData).unwrap();
      dispatch(setCredentials(result));
      toast({
        title: "¡Bienvenido!",
        description: "Has iniciado sesión correctamente",
      });
      navigate("/dashboard");
    } catch (err: any) {
      toast({
        title: "Error de inicio de sesión",
        description: err.data?.error || "Usuario o contraseña incorrectos",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-2xl shadow-lg">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-primary">CapsuleCare</h1>
        <p className="text-gray-600 mt-2">Tu asistente de medicación</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="username" className="text-gray-700">
            Usuario
          </Label>
          <Input
            id="username"
            type="text"
            value={formData.username}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, username: e.target.value }))
            }
            placeholder="Ingresa tu usuario"
            required
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="password" className="text-gray-700">
            Contraseña
          </Label>
          <Input
            id="password"
            type="password"
            value={formData.password}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, password: e.target.value }))
            }
            placeholder="Ingresa tu contraseña"
            required
            className="mt-1"
          />
        </div>
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-primary hover:bg-primary-dark text-white rounded-xl h-12 text-lg font-medium"
        >
          {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
        </Button>

        <div className="text-center space-y-2">
          <Button
            type="button"
            variant="link"
            className="text-primary text-sm"
            onClick={() => navigate("/forgot-password")}
          >
            ¿Olvidaste tu contraseña?
          </Button>

          <Button
            type="button"
            variant="link"
            className="text-primary"
            onClick={() => navigate("/register")}
          >
            ¿No tienes cuenta? Regístrate
          </Button>
        </div>
      </form>
    </div>
  );
};
