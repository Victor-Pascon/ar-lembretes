import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { LogOut, QrCode, User, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import type { User as SupabaseUser, Session } from "@supabase/supabase-js";

const Index = () => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Erro ao sair",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Até logo!",
        description: "Você foi desconectado com sucesso",
      });
      navigate("/auth");
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-auth-gradient">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!session || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-auth-gradient">
        <div className="text-center space-y-8 p-8">
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center shadow-glow">
              <QrCode className="w-10 h-10 text-white" />
            </div>
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-white">AR Reminder</h1>
            <p className="text-lg text-auth-muted max-w-md">
              Sistema de Lembretes com Realidade Aumentada via QR Codes
            </p>
          </div>
          <Button
            onClick={() => navigate("/auth")}
            className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white font-semibold px-8 py-6 text-lg shadow-glow"
          >
            Acessar Painel de Administração
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
              <QrCode className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg text-foreground">AR Reminder</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <User className="w-4 h-4" />
              <span className="text-sm">{user.email}</span>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleLogout}
              className="border-border hover:bg-muted"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-12">
        <div className="text-center space-y-6">
          <h1 className="text-3xl font-bold text-foreground">
            Bem-vindo ao Painel de Administração
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Gerencie seus QR Codes e lembretes em realidade aumentada. 
            Comece criando seu primeiro código ou explore as funcionalidades disponíveis.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-12 max-w-5xl mx-auto">
            <DashboardCard
              icon="🎭"
              title="Meu Avatar"
              description="Crie ou edite seu avatar 3D"
              count=""
              onClick={() => navigate("/create-avatar")}
            />
            <DashboardCard
              icon="🎯"
              title="QR Codes"
              description="Gerencie seus códigos únicos"
              count="0"
            />
            <DashboardCard
              icon="📱"
              title="Lembretes AR"
              description="Crie lembretes em realidade aumentada"
              count="0"
            />
            <DashboardCard
              icon="👥"
              title="Usuários"
              description="Gerencie acessos e permissões"
              count="1"
            />
          </div>
        </div>
      </main>
    </div>
  );
};

interface DashboardCardProps {
  icon: string;
  title: string;
  description: string;
  count: string;
  onClick?: () => void;
}

const DashboardCard = ({ icon, title, description, count, onClick }: DashboardCardProps) => (
  <div 
    className="p-6 bg-card rounded-xl border border-border hover:shadow-lg transition-shadow cursor-pointer group"
    onClick={onClick}
  >
    <div className="flex items-start justify-between mb-4">
      <span className="text-3xl">{icon}</span>
      {count && <span className="text-2xl font-bold text-primary">{count}</span>}
    </div>
    <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
      {title}
    </h3>
    <p className="text-sm text-muted-foreground">{description}</p>
  </div>
);

export default Index;
