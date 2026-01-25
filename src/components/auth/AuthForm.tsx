import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, Loader2, Mail, Lock, User } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { PasswordStrength } from "./PasswordStrength";

const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
});

const signupSchema = z.object({
  name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

type LoginFormData = z.infer<typeof loginSchema>;
type SignupFormData = z.infer<typeof signupSchema>;

interface AuthFormProps {
  isLogin: boolean;
  onToggleMode: () => void;
  onForgotPassword: () => void;
}

export const AuthForm = ({ isLogin, onToggleMode, onForgotPassword }: AuthFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const signupForm = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  const password = isLogin ? loginForm.watch("password") : signupForm.watch("password");

  const handleLogin = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) {
        if (error.message === "Invalid login credentials") {
          toast({
            title: "Erro no login",
            description: "Email ou senha incorretos",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Erro no login",
            description: error.message,
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Login realizado!",
          description: "Bem-vindo de volta!",
        });
      }
    } catch {
      toast({
        title: "Erro",
        description: "Ocorreu um erro inesperado",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (data: SignupFormData) => {
    setIsLoading(true);
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            name: data.name,
          },
        },
      });

      if (error) {
        if (error.message.includes("already registered")) {
          toast({
            title: "Erro no cadastro",
            description: "Este email já está cadastrado",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Erro no cadastro",
            description: error.message,
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Conta criada!",
          description: "Você foi cadastrado com sucesso",
        });
      }
    } catch {
      toast({
        title: "Erro",
        description: "Ocorreu um erro inesperado",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = isLogin 
    ? loginForm.handleSubmit(handleLogin) 
    : signupForm.handleSubmit(handleSignup);

  return (
    <div className="bg-auth-card rounded-2xl p-8 shadow-card border border-auth-border backdrop-blur-xl animate-fade-in">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          {isLogin ? "Bem-vindo de volta" : "Criar nova conta"}
        </h2>
        <p className="text-muted-foreground">
          {isLogin 
            ? "Entre com suas credenciais para acessar o painel" 
            : "Preencha os dados para se cadastrar"}
        </p>
      </div>

      {/* Form */}
      <form onSubmit={onSubmit} className="space-y-5">
        {!isLogin && (
          <div className="space-y-2">
            <Label htmlFor="name" className="text-foreground">Nome</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                id="name"
                type="text"
                placeholder="Seu nome completo"
                className="pl-10 h-12 bg-auth-input border-auth-border focus:border-auth-primary focus:ring-auth-primary"
                {...signupForm.register("name")}
              />
            </div>
            {signupForm.formState.errors.name && (
              <p className="text-sm text-destructive">{signupForm.formState.errors.name.message}</p>
            )}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="email" className="text-foreground">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            {isLogin ? (
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                className="pl-10 h-12 bg-auth-input border-auth-border focus:border-auth-primary focus:ring-auth-primary"
                {...loginForm.register("email")}
              />
            ) : (
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                className="pl-10 h-12 bg-auth-input border-auth-border focus:border-auth-primary focus:ring-auth-primary"
                {...signupForm.register("email")}
              />
            )}
          </div>
          {isLogin && loginForm.formState.errors.email && (
            <p className="text-sm text-destructive">{loginForm.formState.errors.email.message}</p>
          )}
          {!isLogin && signupForm.formState.errors.email && (
            <p className="text-sm text-destructive">{signupForm.formState.errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-foreground">Senha</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            {isLogin ? (
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="pl-10 pr-10 h-12 bg-auth-input border-auth-border focus:border-auth-primary focus:ring-auth-primary"
                {...loginForm.register("password")}
              />
            ) : (
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="pl-10 pr-10 h-12 bg-auth-input border-auth-border focus:border-auth-primary focus:ring-auth-primary"
                {...signupForm.register("password")}
              />
            )}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          {isLogin && loginForm.formState.errors.password && (
            <p className="text-sm text-destructive">{loginForm.formState.errors.password.message}</p>
          )}
          {!isLogin && signupForm.formState.errors.password && (
            <p className="text-sm text-destructive">{signupForm.formState.errors.password.message}</p>
          )}
          {!isLogin && password && <PasswordStrength password={password} />}
        </div>

        {!isLogin && (
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-foreground">Confirmar Senha</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                className="pl-10 pr-10 h-12 bg-auth-input border-auth-border focus:border-auth-primary focus:ring-auth-primary"
                {...signupForm.register("confirmPassword")}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {signupForm.formState.errors.confirmPassword && (
              <p className="text-sm text-destructive">{signupForm.formState.errors.confirmPassword.message}</p>
            )}
          </div>
        )}

        {isLogin && (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                className="border-auth-border data-[state=checked]:bg-auth-primary data-[state=checked]:border-auth-primary"
              />
              <Label htmlFor="remember" className="text-sm text-muted-foreground cursor-pointer">
                Lembrar-me
              </Label>
            </div>
            <button
              type="button"
              onClick={onForgotPassword}
              className="text-sm text-auth-primary hover:text-auth-accent transition-colors"
            >
              Esqueceu a senha?
            </button>
          </div>
        )}

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-12 bg-gradient-to-r from-auth-primary to-auth-accent hover:opacity-90 transition-opacity text-white font-semibold text-base shadow-glow"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              {isLogin ? "Entrando..." : "Criando conta..."}
            </>
          ) : (
            isLogin ? "Entrar" : "Criar Conta"
          )}
        </Button>
      </form>

      {/* Toggle mode */}
      <div className="mt-6 text-center">
        <p className="text-muted-foreground">
          {isLogin ? "Não tem uma conta?" : "Já tem uma conta?"}{" "}
          <button
            type="button"
            onClick={onToggleMode}
            className="text-auth-primary hover:text-auth-accent font-semibold transition-colors"
          >
            {isLogin ? "Cadastre-se" : "Faça login"}
          </button>
        </p>
      </div>
    </div>
  );
};
