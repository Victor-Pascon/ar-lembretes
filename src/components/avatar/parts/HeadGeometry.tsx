import { memo } from "react";
import * as THREE from "three";
import { AvatarConfig } from "../AvatarModel";

interface HeadGeometryProps {
  config: AvatarConfig;
  skinMaterial: THREE.MeshStandardMaterial;
}

const HeadGeometry = memo(({ config, skinMaterial }: HeadGeometryProps) => {
  // Cartoon proportions - bigger head
  const getHeadScale = () => {
    switch (config.faceShape) {
      case "round":
        return { x: 1.1, y: 1.0, z: 1.0 };
      case "oval":
        return { x: 0.95, y: 1.1, z: 0.95 };
      case "square":
        return { x: 1.1, y: 1.0, z: 1.0 };
      case "heart":
        return { x: 1.0, y: 1.05, z: 0.95 };
      default:
        return { x: 1.0, y: 1.0, z: 1.0 };
    }
  };

  const getChinScale = () => {
    switch (config.faceShape) {
      case "round":
        return { size: 0.3, y: -0.5 };
      case "oval":
        return { size: 0.25, y: -0.55 };
      case "square":
        return { size: 0.35, y: -0.45 };
      case "heart":
        return { size: 0.2, y: -0.52 };
      default:
        return { size: 0.28, y: -0.5 };
    }
  };

  const headScale = getHeadScale();
  const chinScale = getChinScale();

  // Outline material for cartoon effect
  const outlineMaterial = new THREE.MeshBasicMaterial({
    color: "#2d2d2d",
    side: THREE.BackSide,
  });

  return (
    <group position={[0, 1.6, 0]}>
      {/* Outline for cartoon effect */}
      <mesh material={outlineMaterial} scale={[headScale.x * 1.03, headScale.y * 1.03, headScale.z * 1.03]}>
        <sphereGeometry args={[0.75, 32, 32]} />
      </mesh>
      
      {/* Main head - bigger for cartoon style */}
      <mesh material={skinMaterial} scale={[headScale.x, headScale.y, headScale.z]}>
        <sphereGeometry args={[0.75, 32, 32]} />
      </mesh>

      {/* Chin definition - softer for cartoon */}
      <mesh material={skinMaterial} position={[0, chinScale.y, 0.2]}>
        <sphereGeometry args={[chinScale.size, 16, 16]} />
      </mesh>

      {/* Cheeks - rounder for cartoon/cute look */}
      <mesh material={skinMaterial} position={[-0.45, -0.05, 0.35]} scale={[0.7, 0.6, 0.6]}>
        <sphereGeometry args={[0.22, 12, 12]} />
      </mesh>
      <mesh material={skinMaterial} position={[0.45, -0.05, 0.35]} scale={[0.7, 0.6, 0.6]}>
        <sphereGeometry args={[0.22, 12, 12]} />
      </mesh>

      {/* Ears - smaller and rounder for cartoon */}
      <group position={[-0.68, 0.05, 0]}>
        <mesh material={skinMaterial}>
          <sphereGeometry args={[0.12, 12, 12]} />
        </mesh>
      </group>
      <group position={[0.68, 0.05, 0]}>
        <mesh material={skinMaterial}>
          <sphereGeometry args={[0.12, 12, 12]} />
        </mesh>
      </group>
    </group>
  );
});

HeadGeometry.displayName = "HeadGeometry";

export default HeadGeometry;
