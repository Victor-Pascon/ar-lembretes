import { ReactNode } from "react";
import logoArLembretes from "@/assets/logo-ar-lembretes.png";

interface AuthLayoutProps {
  children: ReactNode;
}

export const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-auth-gradient">
      <div className="flex flex-1">
        {/* Left side - Branding */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center p-12 relative overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-20 left-20 w-64 h-64 bg-auth-primary/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-32 right-16 w-48 h-48 bg-auth-accent/20 rounded-full blur-2xl animate-pulse delay-1000" />
            <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-auth-secondary/30 rounded-full blur-xl animate-pulse delay-500" />
          </div>

          <div className="relative z-10 text-center space-y-8 max-w-md">
            {/* Logo */}
            <div className="flex justify-center">
              <img 
                src={logoArLembretes} 
                alt="AR Lembretes" 
                className="w-48 h-48 object-contain drop-shadow-2xl"
              />
            </div>

            {/* Title */}
            <div className="space-y-4">
              <h1 className="text-4xl font-bold text-white">
                AR Lembretes
              </h1>
            <p className="text-lg text-auth-muted">
              Sistema de Lembretes com Realidade Aumentada
            </p>
          </div>

          {/* Features */}
          <div className="space-y-4 text-left">
            <FeatureItem 
              icon="🎯" 
              title="QR Codes Únicos" 
              description="Cada lembrete fixado em um código exclusivo"
            />
            <FeatureItem 
              icon="📱" 
              title="Realidade Aumentada" 
              description="Visualize lembretes no mundo real"
            />
            <FeatureItem 
              icon="🔒" 
              title="Acesso Seguro" 
              description="Área exclusiva para administradores"
            />
          </div>
        </div>
      </div>

        {/* Right side - Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
          <div className="w-full max-w-md">
            {children}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-4 text-center text-auth-muted text-sm">
        © {new Date().getFullYear()} AR Lembretes. By João Victor A.S Pascon
      </footer>
    </div>
  );
};

interface FeatureItemProps {
  icon: string;
  title: string;
  description: string;
}

const FeatureItem = ({ icon, title, description }: FeatureItemProps) => (
  <div className="flex items-start gap-4 p-4 bg-white/5 rounded-xl backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors">
    <span className="text-2xl">{icon}</span>
    <div>
      <h3 className="font-semibold text-white">{title}</h3>
      <p className="text-sm text-auth-muted">{description}</p>
    </div>
  </div>
);
