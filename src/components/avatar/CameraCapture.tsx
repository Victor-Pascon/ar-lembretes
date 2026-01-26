import { useRef, useState, useCallback } from "react";
import Webcam from "react-webcam";
import { Button } from "@/components/ui/button";
import { Camera, RotateCcw, SwitchCamera, Loader2 } from "lucide-react";
import FaceGuide from "./FaceGuide";
import { cn } from "@/lib/utils";

interface CameraCaptureProps {
  onCapture: (imageSrc: string) => void;
  onSkip?: () => void;
}

const CameraCapture = ({ onCapture, onSkip }: CameraCaptureProps) => {
  const webcamRef = useRef<Webcam>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isAligned, setIsAligned] = useState(false);

  const videoConstraints = {
    width: 720,
    height: 960,
    facingMode: facingMode,
  };

  const handleUserMedia = useCallback(() => {
    setIsLoading(false);
    setHasError(false);
    // Simulate face alignment detection after camera loads
    setTimeout(() => setIsAligned(true), 2000);
  }, []);

  const handleUserMediaError = useCallback(() => {
    setIsLoading(false);
    setHasError(true);
  }, []);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setCapturedImage(imageSrc);
    }
  }, []);

  const retake = useCallback(() => {
    setCapturedImage(null);
  }, []);

  const confirmCapture = useCallback(() => {
    if (capturedImage) {
      onCapture(capturedImage);
    }
  }, [capturedImage, onCapture]);

  const toggleCamera = useCallback(() => {
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
  }, []);

  if (hasError) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center space-y-4">
        <div className="w-20 h-20 rounded-full bg-destructive/20 flex items-center justify-center">
          <Camera className="w-10 h-10 text-destructive" />
        </div>
        <h3 className="text-xl font-semibold text-foreground">
          Câmera não disponível
        </h3>
        <p className="text-muted-foreground max-w-sm">
          Não foi possível acessar sua câmera. Verifique as permissões do navegador
          ou use um dispositivo com câmera.
        </p>
        {onSkip && (
          <Button variant="outline" onClick={onSkip}>
            Pular esta etapa
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-6">
      {/* Camera container */}
      <div className="relative w-full max-w-md aspect-[3/4] bg-black rounded-2xl overflow-hidden shadow-2xl border-2 border-border">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background z-10">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Iniciando câmera...</p>
            </div>
          </div>
        )}

        {capturedImage ? (
          <img
            src={capturedImage}
            alt="Captured"
            className="w-full h-full object-cover"
            style={{ transform: facingMode === "user" ? "scaleX(-1)" : "none" }}
          />
        ) : (
          <Webcam
            ref={webcamRef}
            audio={false}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
            onUserMedia={handleUserMedia}
            onUserMediaError={handleUserMediaError}
            mirrored={facingMode === "user"}
            className="w-full h-full object-cover"
          />
        )}

        {!capturedImage && !isLoading && <FaceGuide isAligned={isAligned} />}

        {/* Camera switch button */}
        {!capturedImage && !isLoading && (
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleCamera}
            className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white rounded-full"
          >
            <SwitchCamera className="w-5 h-5" />
          </Button>
        )}
      </div>

      {/* Instructions */}
      <div className="text-center space-y-1">
        <p className="text-sm text-muted-foreground">
          {capturedImage
            ? "Verifique se a captura ficou boa"
            : "Posicione seu rosto dentro do guia oval"}
        </p>
      </div>

      {/* Action buttons */}
      <div className="flex gap-4">
        {capturedImage ? (
          <>
            <Button
              variant="outline"
              onClick={retake}
              className="gap-2 border-border hover:bg-muted"
            >
              <RotateCcw className="w-4 h-4" />
              Refazer
            </Button>
            <Button
              onClick={confirmCapture}
              className={cn(
                "gap-2 bg-gradient-to-r from-primary to-accent",
                "hover:opacity-90 text-white shadow-glow"
              )}
            >
              <Camera className="w-4 h-4" />
              Usar esta foto
            </Button>
          </>
        ) : (
          <Button
            onClick={capture}
            disabled={isLoading}
            size="lg"
            className={cn(
              "gap-2 px-8 bg-gradient-to-r from-primary to-accent",
              "hover:opacity-90 text-white shadow-glow",
              "disabled:opacity-50"
            )}
          >
            <Camera className="w-5 h-5" />
            Capturar Rosto
          </Button>
        )}
      </div>
    </div>
  );
};

export default CameraCapture;
