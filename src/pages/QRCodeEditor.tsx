import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { QRCodeVisualEditor } from "@/components/reminders/QRCodeVisualEditor";
import { Loader2 } from "lucide-react";
import type { ReminderWithLocation } from "@/hooks/useReminders";
import type { QRVisualConfig } from "@/types/qr-visual-config";

export default function QRCodeEditor() {
  const { reminderId } = useParams<{ reminderId: string }>();
  const navigate = useNavigate();
  const [reminder, setReminder] = useState<ReminderWithLocation | null>(null);
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
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          navigate("/auth");
          return;
        }

        const { data, error } = await supabase
          .from("reminders")
          .select(`
            *,
            locations (
              id,
              name,
              address
            )
          `)
          .eq("id", reminderId)
          .eq("user_id", user.id)
          .maybeSingle();

        if (error) throw error;
        
        if (!data) {
          setError("Lembrete não encontrado");
          return;
        }

        setReminder(data);
      } catch (err) {
        console.error("Error fetching reminder:", err);
        setError("Erro ao carregar lembrete");
      } finally {
        setIsLoading(false);
      }
    }

    fetchReminder();
  }, [reminderId, navigate]);

  const handleSave = async (config: QRVisualConfig) => {
    if (!reminder) return;

    const { error } = await supabase
      .from("reminders")
      .update({ qr_code_style: JSON.parse(JSON.stringify(config)) })
      .eq("id", reminder.id);

    if (error) throw error;
  };

  const handleBack = () => {
    navigate("/");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Carregando editor...</p>
        </div>
      </div>
    );
  }

  if (error || !reminder) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">Erro</h1>
          <p className="text-muted-foreground mb-4">{error || "Lembrete não encontrado"}</p>
          <button
            onClick={() => navigate("/")}
            className="text-primary hover:underline"
          >
            Voltar ao início
          </button>
        </div>
      </div>
    );
  }

  return (
    <QRCodeVisualEditor
      reminder={reminder}
      onSave={handleSave}
      onBack={handleBack}
    />
  );
}
