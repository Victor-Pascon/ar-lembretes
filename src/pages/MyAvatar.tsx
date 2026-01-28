import { useState, useEffect, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import { ArrowLeft, Pencil, Save, X, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import AvatarModel, { AvatarConfig } from "@/components/avatar/AvatarModel";
import AvatarCustomizer from "@/components/avatar/AvatarCustomizer";
import { useProfile } from "@/hooks/useProfile";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const defaultAvatarConfig: AvatarConfig = {
  skinColor: "#deb887",
  hairColor: "#4a3728",
  eyeColor: "#634e34",
  hairStyle: "medium",
  faceShape: "oval",
  expression: "neutral",
  hasGlasses: false,
  glassesStyle: "round",
  hasHat: false,
  hatStyle: "none",
  hasEarrings: false,
  hasFacialHair: false,
  facialHairStyle: "none",
  bodyStyle: "average",
};

const normalizeAvatarConfig = (config: any): AvatarConfig => {
  if (!config) return defaultAvatarConfig;
  return {
    skinColor: config.skinColor || defaultAvatarConfig.skinColor,
    hairColor: config.hairColor || defaultAvatarConfig.hairColor,
    eyeColor: config.eyeColor || defaultAvatarConfig.eyeColor,
    hairStyle: config.hairStyle || defaultAvatarConfig.hairStyle,
    faceShape: config.faceShape || defaultAvatarConfig.faceShape,
    expression: config.expression || defaultAvatarConfig.expression,
    hasGlasses: config.hasGlasses ?? defaultAvatarConfig.hasGlasses,
    glassesStyle: config.glassesStyle || defaultAvatarConfig.glassesStyle,
    hasHat: config.hasHat ?? defaultAvatarConfig.hasHat,
    hatStyle: config.hatStyle || defaultAvatarConfig.hatStyle,
    hasEarrings: config.hasEarrings ?? defaultAvatarConfig.hasEarrings,
    hasFacialHair: config.hasFacialHair ?? defaultAvatarConfig.hasFacialHair,
    facialHairStyle: config.facialHairStyle || defaultAvatarConfig.facialHairStyle,
    bodyStyle: config.bodyStyle || defaultAvatarConfig.bodyStyle,
  };
};

const hairStyleLabels: Record<string, string> = {
  short: "Curto",
  medium: "Médio",
  long: "Longo",
  curly: "Cacheado",
  ponytail: "Rabo de Cavalo",
  mohawk: "Moicano",
  bald: "Careca",
};

const faceShapeLabels: Record<string, string> = {
  round: "Redondo",
  oval: "Oval",
  square: "Quadrado",
  heart: "Coração",
};

const expressionLabels: Record<string, string> = {
  happy: "Feliz",
  neutral: "Neutro",
  surprised: "Surpreso",
  wink: "Piscando",
};

const bodyStyleLabels: Record<string, string> = {
  slim: "Magro",
  average: "Médio",
  athletic: "Atlético",
};

export default function MyAvatar() {
  const navigate = useNavigate();
  const { profile, isLoading } = useProfile();
  const [mode, setMode] = useState<"view" | "edit">("view");
  const [avatarConfig, setAvatarConfig] = useState<AvatarConfig>(defaultAvatarConfig);
  const [originalConfig, setOriginalConfig] = useState<AvatarConfig | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (profile?.avatar_config) {
      const config = normalizeAvatarConfig(profile.avatar_config);
      setAvatarConfig(config);
    }
  }, [profile]);

  const handleStartEdit = () => {
    setOriginalConfig({ ...avatarConfig });
    setMode("edit");
  };

  const handleCancelEdit = () => {
    if (originalConfig) {
      setAvatarConfig(originalConfig);
    }
    setOriginalConfig(null);
    setMode("view");
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      const { error } = await supabase
        .from("profiles")
        .update({ avatar_config: avatarConfig as any })
        .eq("user_id", user.id);

      if (error) throw error;

      toast({
        title: "Avatar salvo!",
        description: "Suas alterações foram salvas com sucesso.",
      });
      setOriginalConfig(null);
      setMode("view");
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar as alterações.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-4xl mx-auto space-y-4">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-[400px] w-full rounded-xl" />
        </div>
      </div>
    );
  }

  const hasAvatar = !!profile?.avatar_config;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate("/")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <h1 className="font-semibold text-lg">Meu Avatar 3D</h1>
          <div className="w-24" />
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-4xl">
        {mode === "view" ? (
          <div className="space-y-6">
            {/* Avatar Preview */}
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="h-[350px] bg-gradient-to-b from-muted/50 to-muted">
                  {hasAvatar ? (
                    <Canvas camera={{ position: [0, 0, 4], fov: 45 }}>
                      <Suspense fallback={null}>
                        <ambientLight intensity={0.6} />
                        <directionalLight position={[5, 5, 5]} intensity={0.8} />
                        <AvatarModel config={avatarConfig} autoRotate animated />
                        <OrbitControls
                          enablePan={false}
                          enableZoom={false}
                          minPolarAngle={Math.PI / 3}
                          maxPolarAngle={Math.PI / 2}
                        />
                        <Environment preset="studio" />
                      </Suspense>
                    </Canvas>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
                      <User className="w-20 h-20 mb-4 opacity-30" />
                      <p className="text-lg font-medium">Nenhum avatar criado</p>
                      <p className="text-sm">Clique em editar para criar seu avatar</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Avatar Info */}
            {hasAvatar && (
              <Card>
                <CardContent className="p-4 space-y-4">
                  <div className="text-center">
                    <h2 className="text-lg font-semibold">{profile?.name}</h2>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Cabelo</span>
                      <Badge variant="secondary">
                        {hairStyleLabels[avatarConfig.hairStyle]}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Formato do Rosto</span>
                      <Badge variant="secondary">
                        {faceShapeLabels[avatarConfig.faceShape]}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Expressão</span>
                      <Badge variant="secondary">
                        {expressionLabels[avatarConfig.expression]}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Corpo</span>
                      <Badge variant="secondary">
                        {bodyStyleLabels[avatarConfig.bodyStyle]}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Acessórios</span>
                      <div className="flex gap-1 flex-wrap justify-end">
                        {avatarConfig.hasGlasses && <Badge variant="outline">Óculos</Badge>}
                        {avatarConfig.hasHat && <Badge variant="outline">Chapéu</Badge>}
                        {avatarConfig.hasEarrings && <Badge variant="outline">Brincos</Badge>}
                        {avatarConfig.hasFacialHair && <Badge variant="outline">Barba</Badge>}
                        {!avatarConfig.hasGlasses && !avatarConfig.hasHat && !avatarConfig.hasEarrings && !avatarConfig.hasFacialHair && (
                          <Badge variant="outline">Nenhum</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Edit Button */}
            <Button onClick={handleStartEdit} className="w-full" size="lg">
              <Pencil className="w-4 h-4 mr-2" />
              {hasAvatar ? "Editar Avatar" : "Criar Avatar"}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Edit Header */}
            <div className="flex items-center justify-between">
              <Button variant="ghost" onClick={handleCancelEdit}>
                <X className="w-4 h-4 mr-2" />
                Cancelar
              </Button>
              <Button onClick={handleSave} disabled={isSaving}>
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? "Salvando..." : "Salvar"}
              </Button>
            </div>

            {/* Avatar Customizer */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="h-[350px] bg-gradient-to-b from-muted/50 to-muted">
                    <Canvas camera={{ position: [0, 0, 4], fov: 45 }}>
                      <Suspense fallback={null}>
                        <ambientLight intensity={0.6} />
                        <directionalLight position={[5, 5, 5]} intensity={0.8} />
                        <AvatarModel config={avatarConfig} animated />
                        <OrbitControls
                          enablePan={false}
                          enableZoom={true}
                          minDistance={2}
                          maxDistance={6}
                          minPolarAngle={Math.PI / 4}
                          maxPolarAngle={Math.PI / 1.5}
                        />
                        <Environment preset="studio" />
                      </Suspense>
                    </Canvas>
                  </div>
                </CardContent>
              </Card>

              <AvatarCustomizer config={avatarConfig} onChange={setAvatarConfig} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
