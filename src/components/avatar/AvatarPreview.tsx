import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows } from "@react-three/drei";
import AvatarModel, { AvatarConfig } from "./AvatarModel";
import { cn } from "@/lib/utils";

interface AvatarPreviewProps {
  config: AvatarConfig;
  className?: string;
  autoRotate?: boolean;
}

const AvatarPreview = ({ config, className, autoRotate = true }: AvatarPreviewProps) => {
  return (
    <div className={cn(
      "w-full aspect-square rounded-2xl overflow-hidden",
      "bg-gradient-to-b from-primary/10 to-accent/10",
      "border-2 border-border shadow-xl",
      className
    )}>
      <Canvas
        camera={{ position: [0, 1, 4], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} castShadow />
        <directionalLight position={[-5, 3, -5]} intensity={0.3} color="#a855f7" />
        <pointLight position={[0, 3, 0]} intensity={0.5} color="#c084fc" />

        {/* Environment */}
        <Environment preset="studio" />

        {/* Avatar */}
        <AvatarModel config={config} autoRotate={autoRotate} />

        {/* Shadow */}
        <ContactShadows
          position={[0, -1.2, 0]}
          opacity={0.4}
          scale={4}
          blur={2}
          far={4}
        />

        {/* Controls */}
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 1.8}
          target={[0, 1, 0]}
        />
      </Canvas>
    </div>
  );
};

export default AvatarPreview;
