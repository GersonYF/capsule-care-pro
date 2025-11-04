import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useVerifyResetTokenMutation, useResetPasswordMutation } from "@/store/api/authApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, XCircle } from "lucide-react";

export const ResetPasswordForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  
  const [verifyToken, { isLoading: isVerifying }] = useVerifyResetTokenMutation();
  const [resetPassword, { isLoading: isResetting }] = useResetPasswordMutation();
  
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);
  const [userEmail, setUserEmail] = useState("");
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [resetSuccess, setResetSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const verify = async () => {
      try {
        const result = await verifyToken({ token }).unwrap();
        setTokenValid(result.valid);
        if (result.email) {
          setUserEmail(result.email);
        }
      } catch (err) {
        setTokenValid(false);
      }
    };

    verify();
  }, [token, verifyToken, navigate]);

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

    if (formData.password.length < 6) {
      toast({
        title: "Error",
        description: "La contraseña debe tener al menos 6 caracteres",
        variant: "destructive",
      });
      return;
    }

    try {
      await resetPassword({ token: token!, password: formData.password }).unwrap();
      setResetSuccess(true);
      toast({
        title: "¡Contraseña restablecida!",
        description: "Tu contraseña ha sido actualizada correctamente",
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.data?.error || "No se pudo restablecer la contraseña",
        variant: "destructive",
      });
    }
  };

  if (isVerifying) {
    return (
      <div className="w-full max-w-md mx-auto p-6 bg-white rounded-2xl shadow-lg">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando token...</p>
        </div>
      </div>
    );
  }

  if (tokenValid === false) {
    return (
      <div className="w-full max-w-md mx-auto p-6 bg-white rounded-2xl shadow-lg">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Token inválido o expirado
          </h1>
          <p className="text-gray-600 mb-6">
            El enlace de restablecimiento no es válido o ha expirado. Por favor, solicita uno nuevo.
          </p>
          <Button
            onClick={() => navigate("/forgot-password")}
            className="w-full bg-primary hover:bg-primary-dark text-white rounded-xl h-12"
          >
            Solicitar nuevo enlace
          </Button>
        </div>
      </div>
    );
  }

  if (resetSuccess) {
    return (
      <div className="w-full max-w-md mx-auto p-6 bg-white rounded-2xl shadow-lg">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            ¡Contraseña restablecida!
          </h1>
          <p className="text-gray-600 mb-6">
            Tu contraseña ha sido actualizada correctamente. Ya puedes iniciar sesión con tu nueva contraseña.
          </p>
          <Button
            onClick={() => navigate("/login")}
            className="w-full bg-primary hover:bg-primary-dark text-white rounded-xl h-12"
          >
            Ir al inicio de sesión
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-2xl shadow-lg">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-primary">Nueva Contraseña</h1>
        <p className="text-gray-600 mt-2">
          Restableciendo contraseña para: <strong>{userEmail}</strong>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="password" className="text-gray-700">Nueva Contraseña</Label>
          <Input
            id="password"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
            placeholder="Ingresa tu nueva contraseña"
            required
            minLength={6}
            className="mt-1"
          />
          <p className="text-xs text-gray-500 mt-1">Mínimo 6 caracteres</p>
        </div>

        <div>
          <Label htmlFor="confirmPassword" className="text-gray-700">Confirmar Contraseña</Label>
          <Input
            id="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
            placeholder="Confirma tu nueva contraseña"
            required
            className="mt-1"
          />
        </div>

        <Button 
          type="submit" 
          disabled={isResetting}
          className="w-full bg-primary hover:bg-primary-dark text-white rounded-xl h-12 text-lg font-medium"
        >
          {isResetting ? "Restableciendo..." : "Restablecer Contraseña"}
        </Button>
      </form>
    </div>
  );
};
