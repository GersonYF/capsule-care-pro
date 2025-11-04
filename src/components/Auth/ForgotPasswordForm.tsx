import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForgotPasswordMutation } from "@/store/api/authApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Mail } from "lucide-react";

export const ForgotPasswordForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const result = await forgotPassword({ email }).unwrap();
      
      setEmailSent(true);
      toast({
        title: "Correo enviado",
        description: "Si el correo existe, recibirás instrucciones para restablecer tu contraseña",
      });
      
      // Para desarrollo, mostrar el link
      if (result.reset_url) {
        console.log("Reset URL:", result.reset_url);
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.data?.error || "No se pudo procesar la solicitud",
        variant: "destructive",
      });
    }
  };

  if (emailSent) {
    return (
      <div className="w-full max-w-md mx-auto p-6 bg-white rounded-2xl shadow-lg">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Mail className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Revisa tu correo
          </h1>
          <p className="text-gray-600 mb-6">
            Si el correo {email} está registrado, recibirás instrucciones para restablecer tu contraseña.
          </p>
          <Button
            onClick={() => navigate("/login")}
            variant="outline"
            className="w-full"
          >
            Volver al inicio de sesión
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-2xl shadow-lg">
      <Button
        variant="ghost"
        onClick={() => navigate("/login")}
        className="mb-4 -ml-2"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Volver
      </Button>

      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-primary">¿Olvidaste tu contraseña?</h1>
        <p className="text-gray-600 mt-2">
          Ingresa tu correo y te enviaremos instrucciones para restablecerla
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="email" className="text-gray-700">Correo electrónico</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@email.com"
            required
            className="mt-1"
          />
        </div>

        <Button 
          type="submit" 
          disabled={isLoading}
          className="w-full bg-primary hover:bg-primary-dark text-white rounded-xl h-12 text-lg font-medium"
        >
          {isLoading ? "Enviando..." : "Enviar instrucciones"}
        </Button>
      </form>
    </div>
  );
};
