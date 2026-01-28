import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { format, subDays, startOfMonth, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

interface VisitsByDay {
  date: string;
  count: number;
}

interface VisitsByQR {
  reminderId: string;
  title: string;
  location: string | null;
  totalVisits: number;
  lastVisit: string | null;
  cardViews: number;
  arViews: number;
}

interface AnalyticsStats {
  totalVisits: number;
  visitsThisMonth: number;
  avgPerQR: number;
  visitsByDay: VisitsByDay[];
  visitsByQR: VisitsByQR[];
}

interface QRDetailStats {
  totalVisits: number;
  cardViews: number;
  arViews: number;
  visitsByDay: VisitsByDay[];
  mobileVisits: number;
  desktopVisits: number;
}

export function useAnalytics() {
  const [stats, setStats] = useState<AnalyticsStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setStats(null);
        return;
      }

      // Buscar todas as visitas do usuário
      const { data: visits, error } = await supabase
        .from("qr_visits")
        .select(`
          id,
          reminder_id,
          visited_at,
          view_mode,
          user_agent
        `)
        .eq("user_id", user.id)
        .order("visited_at", { ascending: false });

      if (error) throw error;

      // Buscar lembretes do usuário para mapeamento
      const { data: reminders } = await supabase
        .from("reminders")
        .select(`
          id,
          title,
          locations (name)
        `)
        .eq("user_id", user.id);

      const reminderMap = new Map(
        reminders?.map(r => [r.id, { title: r.title, location: r.locations?.name || null }]) || []
      );

      // Calcular estatísticas
      const now = new Date();
      const monthStart = startOfMonth(now);
      const thirtyDaysAgo = subDays(now, 30);

      const visitsThisMonth = visits?.filter(v => 
        parseISO(v.visited_at) >= monthStart
      ).length || 0;

      // Visitas por dia (últimos 30 dias)
      const visitsByDayMap = new Map<string, number>();
      for (let i = 0; i < 30; i++) {
        const date = format(subDays(now, i), "yyyy-MM-dd");
        visitsByDayMap.set(date, 0);
      }

      visits?.forEach(v => {
        const date = format(parseISO(v.visited_at), "yyyy-MM-dd");
        if (visitsByDayMap.has(date)) {
          visitsByDayMap.set(date, (visitsByDayMap.get(date) || 0) + 1);
        }
      });

      const visitsByDay = Array.from(visitsByDayMap.entries())
        .map(([date, count]) => ({
          date: format(parseISO(date), "dd/MM", { locale: ptBR }),
          count,
        }))
        .reverse();

      // Visitas por QR Code
      const qrStatsMap = new Map<string, {
        totalVisits: number;
        lastVisit: string | null;
        cardViews: number;
        arViews: number;
      }>();

      visits?.forEach(v => {
        const existing = qrStatsMap.get(v.reminder_id) || {
          totalVisits: 0,
          lastVisit: null,
          cardViews: 0,
          arViews: 0,
        };

        existing.totalVisits++;
        if (!existing.lastVisit || v.visited_at > existing.lastVisit) {
          existing.lastVisit = v.visited_at;
        }
        if (v.view_mode === "card") existing.cardViews++;
        if (v.view_mode === "ar") existing.arViews++;

        qrStatsMap.set(v.reminder_id, existing);
      });

      const visitsByQR: VisitsByQR[] = Array.from(qrStatsMap.entries())
        .map(([reminderId, stats]) => {
          const reminder = reminderMap.get(reminderId);
          return {
            reminderId,
            title: reminder?.title || "Lembrete removido",
            location: reminder?.location || null,
            ...stats,
          };
        })
        .sort((a, b) => b.totalVisits - a.totalVisits);

      const totalVisits = visits?.length || 0;
      const uniqueQRs = new Set(visits?.map(v => v.reminder_id)).size;
      const avgPerQR = uniqueQRs > 0 ? totalVisits / uniqueQRs : 0;

      setStats({
        totalVisits,
        visitsThisMonth,
        avgPerQR,
        visitsByDay,
        visitsByQR,
      });
    } catch (error) {
      console.error("Error fetching analytics:", error);
      setStats(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, isLoading, refetch: fetchStats };
}

export function useQRDetailStats(reminderId: string) {
  const [stats, setStats] = useState<QRDetailStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchDetails() {
      setIsLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: visits, error } = await supabase
          .from("qr_visits")
          .select("*")
          .eq("reminder_id", reminderId)
          .eq("user_id", user.id)
          .order("visited_at", { ascending: false });

        if (error) throw error;

        const now = new Date();
        const visitsByDayMap = new Map<string, number>();
        for (let i = 0; i < 7; i++) {
          const date = format(subDays(now, i), "yyyy-MM-dd");
          visitsByDayMap.set(date, 0);
        }

        let cardViews = 0;
        let arViews = 0;
        let mobileVisits = 0;
        let desktopVisits = 0;

        visits?.forEach(v => {
          const date = format(parseISO(v.visited_at), "yyyy-MM-dd");
          if (visitsByDayMap.has(date)) {
            visitsByDayMap.set(date, (visitsByDayMap.get(date) || 0) + 1);
          }

          if (v.view_mode === "card") cardViews++;
          if (v.view_mode === "ar") arViews++;

          if (v.user_agent) {
            const isMobile = /Mobile|Android|iPhone|iPad/i.test(v.user_agent);
            if (isMobile) mobileVisits++;
            else desktopVisits++;
          }
        });

        const visitsByDay = Array.from(visitsByDayMap.entries())
          .map(([date, count]) => ({
            date: format(parseISO(date), "dd/MM", { locale: ptBR }),
            count,
          }))
          .reverse();

        setStats({
          totalVisits: visits?.length || 0,
          cardViews,
          arViews,
          visitsByDay,
          mobileVisits,
          desktopVisits,
        });
      } catch (error) {
        console.error("Error fetching QR details:", error);
      } finally {
        setIsLoading(false);
      }
    }

    if (reminderId) {
      fetchDetails();
    }
  }, [reminderId]);

  return { stats, isLoading };
}
