import { useCallback, useState, useRef, Suspense } from "react";
import Webcam from "react-webcam";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Button } from "@/components/ui/button";
import { X, Info, Camera, AlertCircle, SlidersHorizontal, HelpCircle } from "lucide-react";
import { AvatarConfig } from "@/components/avatar/AvatarModel";
import ARAvatarWithSign from "./ARAvatarWithSign";
import ARControlsOverlay from "./ARControlsOverlay";
import ARGestureHint from "./ARGestureHint";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface ARCameraViewProps {
  message: string;
  avatarConfig: AvatarConfig;
  title: string;
  location?: string;
  creatorName?: string;
  onClose: () => void;
}

const ARCameraView = ({
  message,
  avatarConfig,
  title,
  location,
  creatorName,
  onClose,
}: ARCameraViewProps) => {
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [avatarScale, setAvatarScale] = useState(1);
  const [showControls, setShowControls] = useState(false);
  const [showGestureHint, setShowGestureHint] = useState(true);
  const webcamRef = useRef<Webcam>(null);

  const handleCameraError = useCallback((error: string | DOMException) => {
    console.error("Camera error:", error);
    if (typeof error === "string") {
      setCameraError(error);
    } else {
      if (error.name === "NotAllowedError") {
        setCameraError("Permissão de câmera negada. Por favor, permita o acesso à câmera.");
      } else if (error.name === "NotFoundError") {
        setCameraError("Nenhuma câmera encontrada no dispositivo.");
      } else {
        setCameraError("Erro ao acessar a câmera. Tente novamente.");
      }
    }
  }, []);

  const handleCameraReady = useCallback(() => {
    setIsCameraReady(true);
  }, []);

  if (cameraError) {
    return (
      <div className="fixed inset-0 bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="w-16 h-16 bg-destructive/20 rounded-full flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8 text-destructive" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-foreground">Erro na Câmera</h2>
            <p className="text-muted-foreground">{cameraError}</p>
          </div>
          <div className="flex gap-3 justify-center">
            <Button variant="outline" onClick={onClose}>
              Voltar
            </Button>
            <Button onClick={() => window.location.reload()}>
              Tentar Novamente
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black">
      {/* Camera as background */}
      <Webcam
        ref={webcamRef}
        className="absolute inset-0 w-full h-full object-cover"
        videoConstraints={{
          facingMode: "environment",
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        }}
        onUserMedia={handleCameraReady}
        onUserMediaError={handleCameraError}
        audio={false}
        screenshotFormat="image/jpeg"
      />

      {/* Loading indicator while camera initializes */}
      {!isCameraReady && (
        <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
          <div className="text-center space-y-4">
            <Camera className="w-12 h-12 animate-pulse text-primary mx-auto" />
            <p className="text-muted-foreground">Iniciando câmera...</p>
          </div>
        </div>
      )}

      {/* 3D Canvas overlay */}
      {isCameraReady && (
        <div className="absolute inset-0">
          <Canvas
            gl={{ alpha: true, antialias: true }}
            camera={{ position: [0, 1, 5], fov: 50 }}
            style={{ background: "transparent" }}
          >
            <ambientLight intensity={0.8} />
            <directionalLight position={[5, 5, 5]} intensity={1} />
            <directionalLight position={[-5, 5, 5]} intensity={0.5} />
            <pointLight position={[0, 2, 3]} intensity={0.5} />
            
            <OrbitControls
              enablePan={true}
              enableZoom={true}
              enableRotate={true}
              minDistance={3}
              maxDistance={8}
              target={[0, 1, 0]}
              maxPolarAngle={Math.PI / 1.5}
              minPolarAngle={Math.PI / 4}
            />
            
            <Suspense fallback={null}>
              <ARAvatarWithSign config={avatarConfig} message={message} scale={avatarScale} />
            </Suspense>
          </Canvas>
        </div>
      )}

      {/* Gesture hint for first-time users */}
      {isCameraReady && showGestureHint && (
        <ARGestureHint onDismiss={() => setShowGestureHint(false)} />
      )}

      {/* Controls overlay */}
      {isCameraReady && showControls && (
        <ARControlsOverlay
          scale={avatarScale}
          onScaleChange={setAvatarScale}
          onReset={() => setAvatarScale(1)}
        />
      )}

      {/* Controls overlay */}
      <div className="absolute inset-x-0 top-0 p-4 flex justify-between items-start z-10">
        <Button
          variant="secondary"
          size="icon"
          onClick={onClose}
          className="rounded-full bg-background/80 backdrop-blur-sm shadow-lg"
        >
          <X className="w-5 h-5" />
        </Button>

        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="secondary"
              size="icon"
              className="rounded-full bg-background/80 backdrop-blur-sm shadow-lg"
            >
              <Info className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>{title}</SheetTitle>
              <SheetDescription>
                {location && (
                  <span className="block text-sm text-muted-foreground mb-2">
                    📍 {location}
                  </span>
                )}
                {creatorName && (
                  <span className="block text-sm text-muted-foreground mb-4">
                    Criado por: {creatorName}
                  </span>
                )}
                <span className="block mt-4 p-3 bg-muted rounded-lg">
                  {message}
                </span>
              </SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>

        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="icon"
            className="rounded-full bg-background/80 backdrop-blur-sm shadow-lg"
            onClick={() => setShowGestureHint(true)}
          >
            <HelpCircle className="w-5 h-5" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className={`rounded-full backdrop-blur-sm shadow-lg ${showControls ? 'bg-primary text-primary-foreground' : 'bg-background/80'}`}
            onClick={() => setShowControls(!showControls)}
          >
            <SlidersHorizontal className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* AR indicator */}
      <div className="absolute inset-x-0 bottom-0 p-4 flex justify-center z-10">
        <div className="bg-background/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
          <p className="text-xs text-muted-foreground">
            🎯 Experiência AR ativa
          </p>
        </div>
      </div>
    </div>
  );
};

export default ARCameraView;
