import { memo } from "react";
import * as THREE from "three";
import { AvatarConfig } from "../AvatarModel";

interface FacialHairProps {
  config: AvatarConfig;
  hairMaterial: THREE.MeshStandardMaterial;
}

const FacialHair = memo(({ config, hairMaterial }: FacialHairProps) => {
  if (!config.hasFacialHair || config.facialHairStyle === "none") return null;

  const renderBeard = () => (
    <group position={[0, 1.5, 0]}>
      {/* Full beard coverage */}
      <mesh material={hairMaterial} position={[0, -0.4, 0.35]} scale={[1.2, 1, 0.8]}>
        <sphereGeometry args={[0.3, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
      </mesh>
      {/* Chin beard */}
      <mesh material={hairMaterial} position={[0, -0.55, 0.25]}>
        <sphereGeometry args={[0.2, 12, 12]} />
      </mesh>
      {/* Side burns connecting */}
      <mesh material={hairMaterial} position={[-0.4, -0.2, 0.2]}>
        <capsuleGeometry args={[0.1, 0.25, 8, 16]} />
      </mesh>
      <mesh material={hairMaterial} position={[0.4, -0.2, 0.2]}>
        <capsuleGeometry args={[0.1, 0.25, 8, 16]} />
      </mesh>
      {/* Jaw line */}
      <mesh material={hairMaterial} position={[-0.35, -0.35, 0.25]} rotation={[0, 0, 0.3]}>
        <capsuleGeometry args={[0.08, 0.2, 6, 12]} />
      </mesh>
      <mesh material={hairMaterial} position={[0.35, -0.35, 0.25]} rotation={[0, 0, -0.3]}>
        <capsuleGeometry args={[0.08, 0.2, 6, 12]} />
      </mesh>
      {/* Mustache */}
      <mesh material={hairMaterial} position={[-0.08, -0.22, 0.52]} rotation={[0, 0, 0.2]}>
        <capsuleGeometry args={[0.03, 0.1, 4, 8]} />
      </mesh>
      <mesh material={hairMaterial} position={[0.08, -0.22, 0.52]} rotation={[0, 0, -0.2]}>
        <capsuleGeometry args={[0.03, 0.1, 4, 8]} />
      </mesh>
    </group>
  );

  const renderGoatee = () => (
    <group position={[0, 1.5, 0]}>
      {/* Chin goatee */}
      <mesh material={hairMaterial} position={[0, -0.45, 0.4]}>
        <sphereGeometry args={[0.15, 12, 12]} />
      </mesh>
      <mesh material={hairMaterial} position={[0, -0.55, 0.32]}>
        <capsuleGeometry args={[0.08, 0.12, 6, 12]} />
      </mesh>
      {/* Soul patch area */}
      <mesh material={hairMaterial} position={[0, -0.35, 0.48]}>
        <sphereGeometry args={[0.06, 8, 8]} />
      </mesh>
      {/* Mustache */}
      <mesh material={hairMaterial} position={[-0.06, -0.22, 0.52]} rotation={[0, 0, 0.15]}>
        <capsuleGeometry args={[0.025, 0.08, 4, 8]} />
      </mesh>
      <mesh material={hairMaterial} position={[0.06, -0.22, 0.52]} rotation={[0, 0, -0.15]}>
        <capsuleGeometry args={[0.025, 0.08, 4, 8]} />
      </mesh>
    </group>
  );

  const renderMustache = () => (
    <group position={[0, 1.5, 0]}>
      {/* Thick mustache */}
      <mesh material={hairMaterial} position={[0, -0.2, 0.52]}>
        <capsuleGeometry args={[0.035, 0.02, 4, 8]} />
      </mesh>
      {/* Left side */}
      <mesh material={hairMaterial} position={[-0.1, -0.2, 0.5]} rotation={[0, 0, 0.4]}>
        <capsuleGeometry args={[0.03, 0.12, 4, 8]} />
      </mesh>
      {/* Right side */}
      <mesh material={hairMaterial} position={[0.1, -0.2, 0.5]} rotation={[0, 0, -0.4]}>
        <capsuleGeometry args={[0.03, 0.12, 4, 8]} />
      </mesh>
      {/* Tips curling up slightly */}
      <mesh material={hairMaterial} position={[-0.18, -0.18, 0.45]} rotation={[0, 0, 0.8]}>
        <capsuleGeometry args={[0.02, 0.04, 4, 8]} />
      </mesh>
      <mesh material={hairMaterial} position={[0.18, -0.18, 0.45]} rotation={[0, 0, -0.8]}>
        <capsuleGeometry args={[0.02, 0.04, 4, 8]} />
      </mesh>
    </group>
  );

  const renderStubble = () => {
    // Create a subtle stubble effect with many small dots
    const stubblePositions: [number, number, number][] = [];
    
    // Generate stubble positions on jaw and chin
    for (let i = 0; i < 30; i++) {
      const angle = (i / 30) * Math.PI;
      const radius = 0.3 + Math.random() * 0.15;
      const x = Math.cos(angle) * radius * 0.8;
      const y = -0.35 - Math.random() * 0.2;
      const z = 0.35 + Math.sin(angle) * 0.15;
      stubblePositions.push([x, y, z]);
    }

    // Add mustache area stubble
    for (let i = 0; i < 10; i++) {
      const x = (i - 5) * 0.03;
      stubblePositions.push([x, -0.22, 0.5]);
    }

    return (
      <group position={[0, 1.5, 0]}>
        {stubblePositions.map((pos, i) => (
          <mesh key={i} position={pos}>
            <sphereGeometry args={[0.012 + Math.random() * 0.005, 4, 4]} />
            <meshStandardMaterial 
              color={config.hairColor} 
              roughness={1} 
              transparent 
              opacity={0.7} 
            />
          </mesh>
        ))}
      </group>
    );
  };

  switch (config.facialHairStyle) {
    case "beard":
      return renderBeard();
    case "goatee":
      return renderGoatee();
    case "mustache":
      return renderMustache();
    case "stubble":
      return renderStubble();
    default:
      return null;
  }
});

FacialHair.displayName = "FacialHair";

export default FacialHair;
