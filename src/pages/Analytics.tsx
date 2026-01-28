import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, RefreshCw } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { OverviewStats } from "@/components/analytics/OverviewStats";
import { VisitsChart } from "@/components/analytics/VisitsChart";
import { QRCodeTable } from "@/components/analytics/QRCodeTable";
import { useProfile } from "@/hooks/useProfile";
import { useAnalytics } from "@/hooks/useAnalytics";
import type { Session } from "@supabase/supabase-js";

export default function Analytics() {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  
  const { profile } = useProfile();
  const { stats, isLoading: analyticsLoading, refetch } = useAnalytics();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setIsLoading(false);
        if (!session) {
          navigate("/auth");
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsLoading(false);
      if (!session) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader profile={profile} />

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate("/")}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Dashboard de Analytics
              </h1>
              <p className="text-muted-foreground">
                Acompanhe as visitas aos seus QR Codes
              </p>
            </div>
          </div>
          <Button 
            variant="outline" 
            onClick={refetch}
            disabled={analyticsLoading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${analyticsLoading ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
        </div>

        {/* Overview Stats */}
        <OverviewStats
          totalVisits={stats?.totalVisits || 0}
          visitsThisMonth={stats?.visitsThisMonth || 0}
          avgPerQR={stats?.avgPerQR || 0}
          isLoading={analyticsLoading}
        />

        {/* Chart */}
        <VisitsChart
          data={stats?.visitsByDay || []}
          isLoading={analyticsLoading}
        />

        {/* Table */}
        <QRCodeTable
          data={stats?.visitsByQR || []}
          isLoading={analyticsLoading}
        />
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-muted-foreground text-sm border-t border-border mt-8">
        © {new Date().getFullYear()} AR Lembretes. By João Victor A.S Pascon
      </footer>
    </div>
  );
}
