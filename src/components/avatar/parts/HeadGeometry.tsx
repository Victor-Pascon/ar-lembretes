import { memo } from "react";
import * as THREE from "three";
import { AvatarConfig } from "../AvatarModel";

interface HeadGeometryProps {
  config: AvatarConfig;
  skinMaterial: THREE.MeshStandardMaterial;
}

const HeadGeometry = memo(({ config, skinMaterial }: HeadGeometryProps) => {
  // Get scale factors based on face shape
  const getHeadScale = () => {
    switch (config.faceShape) {
      case "round":
        return { x: 1, y: 0.95, z: 0.95 };
      case "oval":
        return { x: 0.9, y: 1.05, z: 0.9 };
      case "square":
        return { x: 1.05, y: 0.95, z: 0.95 };
      case "heart":
        return { x: 0.95, y: 1, z: 0.9 };
      default:
        return { x: 1, y: 1, z: 1 };
    }
  };

  const getChinScale = () => {
    switch (config.faceShape) {
      case "round":
        return { size: 0.25, y: -0.55 };
      case "oval":
        return { size: 0.22, y: -0.6 };
      case "square":
        return { size: 0.3, y: -0.5 };
      case "heart":
        return { size: 0.18, y: -0.58 };
      default:
        return { size: 0.25, y: -0.55 };
    }
  };

  const headScale = getHeadScale();
  const chinScale = getChinScale();

  return (
    <group position={[0, 1.5, 0]}>
      {/* Main head - ellipsoid shape */}
      <mesh material={skinMaterial} scale={[headScale.x, headScale.y, headScale.z]}>
        <sphereGeometry args={[0.65, 32, 32]} />
      </mesh>

      {/* Chin definition */}
      <mesh material={skinMaterial} position={[0, chinScale.y, 0.15]}>
        <sphereGeometry args={[chinScale.size, 16, 16]} />
      </mesh>

      {/* Cheekbones - subtle definition */}
      <mesh material={skinMaterial} position={[-0.4, -0.1, 0.25]} scale={[0.6, 0.5, 0.5]}>
        <sphereGeometry args={[0.2, 12, 12]} />
      </mesh>
      <mesh material={skinMaterial} position={[0.4, -0.1, 0.25]} scale={[0.6, 0.5, 0.5]}>
        <sphereGeometry args={[0.2, 12, 12]} />
      </mesh>

      {/* Forehead - slight bulge for natural look */}
      <mesh material={skinMaterial} position={[0, 0.35, 0.2]} scale={[0.8, 0.4, 0.4]}>
        <sphereGeometry args={[0.4, 16, 16]} />
      </mesh>

      {/* Ears */}
      <group position={[-0.6, 0, 0]}>
        <mesh material={skinMaterial}>
          <capsuleGeometry args={[0.08, 0.12, 8, 16]} />
        </mesh>
        {/* Ear detail */}
        <mesh material={skinMaterial} position={[0.02, 0, 0]} scale={[0.6, 0.8, 0.8]}>
          <torusGeometry args={[0.06, 0.02, 8, 16]} />
        </mesh>
      </group>
      <group position={[0.6, 0, 0]}>
        <mesh material={skinMaterial}>
          <capsuleGeometry args={[0.08, 0.12, 8, 16]} />
        </mesh>
        <mesh material={skinMaterial} position={[-0.02, 0, 0]} scale={[0.6, 0.8, 0.8]}>
          <torusGeometry args={[0.06, 0.02, 8, 16]} />
        </mesh>
      </group>
    </group>
  );
});

HeadGeometry.displayName = "HeadGeometry";

export default HeadGeometry;
