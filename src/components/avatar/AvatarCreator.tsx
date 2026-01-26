import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Check, Loader2, Sparkles } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import CameraCapture from "./CameraCapture";
import AvatarPreview from "./AvatarPreview";
import AvatarCustomizer from "./AvatarCustomizer";
import StepIndicator from "./StepIndicator";
import { AvatarConfig } from "./AvatarModel";
import { generateAvatarConfig, getDefaultAvatarConfig } from "./AvatarGenerator";
import { cn } from "@/lib/utils";

const steps = [
  { id: 1, title: "Captura" },
  { id: 2, title: "Geração" },
  { id: 3, title: "Customização" },
  { id: 4, title: "Confirmação" },
];

const AvatarCreator = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [_capturedImage, setCapturedImage] = useState<string | null>(null);
  const [avatarConfig, setAvatarConfig] = useState<AvatarConfig>(getDefaultAvatarConfig());
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleCapture = useCallback(async (imageSrc: string) => {
    setCapturedImage(imageSrc);
    setCurrentStep(2);
    setIsGenerating(true);

    try {
      const config = await generateAvatarConfig(imageSrc);
      setAvatarConfig(config);
      
      // Simulate processing time for better UX
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      setCurrentStep(3);
    } catch (error) {
      console.error("Error generating avatar:", error);
      toast({
        title: "Erro ao gerar avatar",
        description: "Não foi possível processar a imagem. Tente novamente.",
        variant: "destructive",
      });
      setCurrentStep(1);
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const handleSkipCapture = useCallback(() => {
    setAvatarConfig(getDefaultAvatarConfig());
    setCurrentStep(3);
  }, []);

  const handleSaveAvatar = async () => {
    setIsSaving(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Erro",
          description: "Você precisa estar logado para salvar o avatar.",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from("profiles")
        .update({
          avatar_config: JSON.parse(JSON.stringify(avatarConfig)),
        })
        .eq("user_id", user.id);

      if (error) throw error;

      toast({
        title: "Avatar salvo!",
        description: "Seu avatar 3D foi salvo com sucesso.",
      });

      setCurrentStep(4);
      
      // Redirect after a short delay
      setTimeout(() => navigate("/"), 2000);
    } catch (error) {
      console.error("Error saving avatar:", error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar o avatar. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleBack = () => {
    if (currentStep === 3) {
      setCurrentStep(1);
      setCapturedImage(null);
    }
  };

  return (
    <div className="min-h-screen bg-auth-gradient py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-white">Criar Avatar 3D</h1>
          <p className="text-auth-muted">
            Crie seu avatar estilizado para experiências em realidade aumentada
          </p>
        </div>

        {/* Step indicator */}
        <StepIndicator steps={steps} currentStep={currentStep} />

        {/* Main content */}
        <div className="bg-card/80 backdrop-blur-xl rounded-2xl border border-border p-6 md:p-8 shadow-card">
          {/* Step 1: Camera Capture */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-xl font-semibold text-foreground">
                  Captura Facial
                </h2>
                <p className="text-sm text-muted-foreground">
                  Posicione seu rosto no guia oval e tire uma foto para gerar seu avatar
                </p>
              </div>
              <CameraCapture onCapture={handleCapture} onSkip={handleSkipCapture} />
            </div>
          )}

          {/* Step 2: Generating */}
          {currentStep === 2 && isGenerating && (
            <div className="flex flex-col items-center justify-center py-16 space-y-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center animate-pulse">
                  <Sparkles className="w-12 h-12 text-white" />
                </div>
                <div className="absolute inset-0 rounded-full bg-primary/30 animate-ping" />
              </div>
              <div className="text-center space-y-2">
                <h2 className="text-xl font-semibold text-foreground">
                  Gerando seu avatar...
                </h2>
                <p className="text-sm text-muted-foreground">
                  Analisando características e criando modelo 3D
                </p>
              </div>
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          )}

          {/* Step 3: Customization */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-xl font-semibold text-foreground">
                  Personalize seu Avatar
                </h2>
                <p className="text-sm text-muted-foreground">
                  Ajuste as cores e características do seu avatar 3D
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Preview */}
                <div className="order-1 md:order-1">
                  <AvatarPreview config={avatarConfig} className="max-w-sm mx-auto" />
                  <p className="text-center text-xs text-muted-foreground mt-2">
                    Arraste para rotacionar
                  </p>
                </div>

                {/* Customizer */}
                <div className="order-2 md:order-2">
                  <AvatarCustomizer config={avatarConfig} onChange={setAvatarConfig} />
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex justify-between pt-4">
                <Button
                  variant="outline"
                  onClick={handleBack}
                  className="gap-2 border-border hover:bg-muted"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Voltar
                </Button>
                <Button
                  onClick={handleSaveAvatar}
                  disabled={isSaving}
                  className={cn(
                    "gap-2 bg-gradient-to-r from-primary to-accent",
                    "hover:opacity-90 text-white shadow-glow"
                  )}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      Confirmar Avatar
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Step 4: Success */}
          {currentStep === 4 && (
            <div className="flex flex-col items-center justify-center py-16 space-y-6">
              <div className="w-24 h-24 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center">
                <Check className="w-12 h-12 text-white" />
              </div>
              <div className="text-center space-y-2">
                <h2 className="text-xl font-semibold text-foreground">
                  Avatar criado com sucesso!
                </h2>
                <p className="text-sm text-muted-foreground">
                  Redirecionando para o painel...
                </p>
              </div>
              <AvatarPreview config={avatarConfig} className="max-w-xs" autoRotate />
            </div>
          )}
        </div>

        {/* Back to dashboard */}
        {currentStep !== 4 && (
          <div className="text-center">
            <Button
              variant="ghost"
              onClick={() => navigate("/")}
              className="text-auth-muted hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao painel
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AvatarCreator;
