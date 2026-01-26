import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, ArrowLeft, MapPin, QrCode } from "lucide-react";

interface ReminderData {
  id: string;
  title: string;
  message: string;
  qr_code_data: string;
  is_active: boolean;
  ar_config: unknown;
  locations?: {
    name: string;
    address: string | null;
  } | null;
  profiles?: {
    name: string;
    avatar_url: string | null;
    avatar_config: unknown;
  } | null;
}

export default function ARPreview() {
  const { reminderId } = useParams();
  const navigate = useNavigate();
  const [reminder, setReminder] = useState<ReminderData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchReminder() {
      if (!reminderId) {
        setError("ID do lembrete não fornecido");
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("reminders")
          .select(`
            id,
            title,
            message,
            qr_code_data,
            is_active,
            ar_config,
            locations (
              name,
              address
            )
          `)
          .eq("qr_code_data", reminderId)
          .eq("is_active", true)
          .maybeSingle();

        if (error) throw error;

        if (!data) {
          setError("Lembrete não encontrado ou inativo");
          setIsLoading(false);
          return;
        }

        // Fetch profile separately if needed
        const { data: profileData } = await supabase
          .from("profiles")
          .select("name, avatar_url, avatar_config")
          .limit(1)
          .maybeSingle();

        setReminder({
          ...data,
          profiles: profileData,
        });
      } catch (err) {
        setError("Erro ao carregar o lembrete");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchReminder();
  }, [reminderId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-auth-gradient flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
          <p className="text-auth-muted">Carregando experiência AR...</p>
        </div>
      </div>
    );
  }

  if (error || !reminder) {
    return (
      <div className="min-h-screen bg-auth-gradient flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center space-y-4">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
              <QrCode className="w-8 h-8 text-muted-foreground" />
            </div>
            <h1 className="text-xl font-bold text-foreground">
              {error || "Lembrete não encontrado"}
            </h1>
            <p className="text-muted-foreground">
              Este QR Code pode estar inativo ou o lembrete foi removido.
            </p>
            <Button onClick={() => navigate("/")} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao início
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-auth-gradient flex items-center justify-center p-4">
      <Card className="w-full max-w-lg overflow-hidden">
        {/* AR Simulation Header */}
        <div className="bg-gradient-to-r from-primary to-accent p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary-foreground/20 rounded-xl flex items-center justify-center">
              <QrCode className="w-6 h-6 text-primary-foreground" />
            </div>
            <div className="text-primary-foreground">
              <p className="text-xs opacity-75">Experiência AR</p>
              <h1 className="font-bold text-lg">{reminder.title}</h1>
            </div>
          </div>
        </div>

        <CardContent className="p-6 space-y-6">
          {/* Location */}
          {reminder.locations && (
            <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
              <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-foreground">{reminder.locations.name}</p>
                {reminder.locations.address && (
                  <p className="text-sm text-muted-foreground">{reminder.locations.address}</p>
                )}
              </div>
            </div>
          )}

          {/* Message */}
          <div className="space-y-2">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Mensagem
            </h2>
            <div className="p-4 bg-muted/30 rounded-xl border border-border">
              <p className="text-foreground whitespace-pre-wrap">{reminder.message}</p>
            </div>
          </div>

          {/* Avatar placeholder */}
          {reminder.profiles && (
            <div className="flex items-center gap-3 pt-4 border-t border-border">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <span className="text-primary-foreground font-medium">
                  {reminder.profiles.name?.charAt(0).toUpperCase() || "A"}
                </span>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Criado por</p>
                <p className="font-medium text-foreground">{reminder.profiles.name}</p>
              </div>
            </div>
          )}

          {/* AR Simulation Notice */}
          <div className="text-center pt-4">
            <p className="text-xs text-muted-foreground">
              🚀 Esta é uma prévia da experiência AR. Em dispositivos compatíveis,
              o conteúdo será exibido em realidade aumentada.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
