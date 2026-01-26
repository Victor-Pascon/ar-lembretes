import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, QrCode } from "lucide-react";
import ARExperience from "@/components/ar/ARExperience";
import { AvatarConfig } from "@/components/avatar/AvatarModel";

interface ReminderData {
  id: string;
  title: string;
  message: string;
  qr_code_data: string;
  is_active: boolean;
  ar_config: unknown;
  user_id: string;
  locations?: {
    name: string;
    address: string | null;
  } | null;
}

interface ProfileData {
  name: string;
  avatar_url: string | null;
  avatar_config: AvatarConfig | null;
}

const defaultAvatarConfig: AvatarConfig = {
  skinColor: "#e0b8a0",
  hairColor: "#3d2314",
  eyeColor: "#4a6741",
  hairStyle: "short",
  hasGlasses: false,
};

export default function ARPreview() {
  const { reminderId } = useParams();
  const navigate = useNavigate();
  const [reminder, setReminder] = useState<ReminderData | null>(null);
  const [profile, setProfile] = useState<ProfileData | null>(null);
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
        // Fetch reminder by qr_code_data
        const { data: reminderData, error: reminderError } = await supabase
          .from("reminders")
          .select(`
            id,
            title,
            message,
            qr_code_data,
            is_active,
            ar_config,
            user_id,
            locations (
              name,
              address
            )
          `)
          .eq("qr_code_data", reminderId)
          .eq("is_active", true)
          .maybeSingle();

        if (reminderError) throw reminderError;

        if (!reminderData) {
          setError("Lembrete não encontrado ou inativo");
          setIsLoading(false);
          return;
        }

        setReminder(reminderData);

        // Fetch creator's profile using the reminder's user_id
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("name, avatar_url, avatar_config")
          .eq("user_id", reminderData.user_id)
          .maybeSingle();

        if (!profileError && profileData) {
          // Parse avatar_config safely
          let parsedAvatarConfig: AvatarConfig | null = null;
          if (profileData.avatar_config && typeof profileData.avatar_config === 'object') {
            const config = profileData.avatar_config as Record<string, unknown>;
            if (
              typeof config.skinColor === 'string' &&
              typeof config.hairColor === 'string' &&
              typeof config.eyeColor === 'string' &&
              typeof config.hairStyle === 'string' &&
              typeof config.hasGlasses === 'boolean'
            ) {
              parsedAvatarConfig = {
                skinColor: config.skinColor,
                hairColor: config.hairColor,
                eyeColor: config.eyeColor,
                hairStyle: config.hairStyle as "short" | "medium" | "long" | "bald",
                hasGlasses: config.hasGlasses,
              };
            }
          }
          
          setProfile({
            name: profileData.name,
            avatar_url: profileData.avatar_url,
            avatar_config: parsedAvatarConfig,
          });
        }
      } catch (err) {
        setError("Erro ao carregar o lembrete");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchReminder();
  }, [reminderId]);

  const handleClose = () => {
    navigate("/");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/20 via-background to-accent/20 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Carregando experiência AR...</p>
        </div>
      </div>
    );
  }

  if (error || !reminder) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/20 via-background to-accent/20 flex items-center justify-center p-4">
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
              Voltar ao início
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Get avatar config from profile or use default
  const avatarConfig: AvatarConfig = profile?.avatar_config || defaultAvatarConfig;

  return (
    <ARExperience
      reminder={{
        title: reminder.title,
        message: reminder.message,
        location: reminder.locations?.name,
        creatorName: profile?.name,
      }}
      avatarConfig={avatarConfig}
      onClose={handleClose}
    />
  );
}
