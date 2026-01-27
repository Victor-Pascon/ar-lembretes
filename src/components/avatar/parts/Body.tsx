import { memo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { AvatarConfig } from "../AvatarModel";

interface BodyProps {
  config: AvatarConfig;
  skinMaterial: THREE.MeshStandardMaterial;
  animated?: boolean;
}

const Body = memo(({ config, skinMaterial, animated = false }: BodyProps) => {
  const bodyRef = useRef<THREE.Group>(null);

  // Breathing animation
  useFrame((state) => {
    if (!animated || !bodyRef.current) return;
    
    const breathe = Math.sin(state.clock.elapsedTime * 1.5) * 0.02;
    bodyRef.current.scale.x = 1 + breathe;
    bodyRef.current.scale.z = 1 + breathe * 0.5;
  });

  // Body proportions based on style
  const getBodyProps = () => {
    switch (config.bodyStyle) {
      case "slim":
        return {
          torsoWidth: 0.35,
          torsoWidthBottom: 0.4,
          shoulderWidth: 0.9,
          shoulderSize: 0.15,
          armSize: 0.08,
        };
      case "athletic":
        return {
          torsoWidth: 0.45,
          torsoWidthBottom: 0.5,
          shoulderWidth: 1.2,
          shoulderSize: 0.22,
          armSize: 0.12,
        };
      case "average":
      default:
        return {
          torsoWidth: 0.4,
          torsoWidthBottom: 0.48,
          shoulderWidth: 1.05,
          shoulderSize: 0.18,
          armSize: 0.1,
        };
    }
  };

  const shirtMaterial = new THREE.MeshStandardMaterial({
    color: "#6366f1",
    roughness: 0.8,
    metalness: 0,
  });

  const bodyProps = getBodyProps();

  return (
    <group ref={bodyRef}>
      {/* Neck */}
      <mesh material={skinMaterial} position={[0, 0.95, 0]}>
        <cylinderGeometry args={[0.15, 0.18, 0.2, 16]} />
      </mesh>

      {/* Upper body / Torso with shirt */}
      <mesh material={shirtMaterial} position={[0, 0.45, 0]}>
        <cylinderGeometry args={[bodyProps.torsoWidth, bodyProps.torsoWidthBottom, 0.9, 16]} />
      </mesh>

      {/* Shirt collar */}
      <mesh material={shirtMaterial} position={[0, 0.88, 0]}>
        <cylinderGeometry args={[0.2, 0.22, 0.08, 16]} />
      </mesh>

      {/* Collar V-neck detail */}
      <mesh material={skinMaterial} position={[0, 0.82, 0.18]} rotation={[-0.3, 0, 0]}>
        <coneGeometry args={[0.08, 0.12, 3]} />
      </mesh>

      {/* Shoulders */}
      <mesh material={shirtMaterial} position={[0, 0.75, 0]} rotation={[0, 0, Math.PI / 2]}>
        <capsuleGeometry args={[bodyProps.shoulderSize, bodyProps.shoulderWidth, 8, 16]} />
      </mesh>

      {/* Arms */}
      {/* Left arm */}
      <group position={[-0.55, 0.55, 0]}>
        {/* Upper arm */}
        <mesh material={shirtMaterial} rotation={[0, 0, 0.15]}>
          <capsuleGeometry args={[bodyProps.armSize, 0.25, 8, 16]} />
        </mesh>
        {/* Lower arm (skin) */}
        <mesh material={skinMaterial} position={[-0.05, -0.35, 0.05]} rotation={[0.2, 0, 0.1]}>
          <capsuleGeometry args={[bodyProps.armSize * 0.85, 0.22, 8, 16]} />
        </mesh>
        {/* Hand */}
        <mesh material={skinMaterial} position={[-0.08, -0.55, 0.1]}>
          <sphereGeometry args={[bodyProps.armSize * 1.1, 12, 12]} />
        </mesh>
      </group>

      {/* Right arm */}
      <group position={[0.55, 0.55, 0]}>
        {/* Upper arm */}
        <mesh material={shirtMaterial} rotation={[0, 0, -0.15]}>
          <capsuleGeometry args={[bodyProps.armSize, 0.25, 8, 16]} />
        </mesh>
        {/* Lower arm (skin) */}
        <mesh material={skinMaterial} position={[0.05, -0.35, 0.05]} rotation={[0.2, 0, -0.1]}>
          <capsuleGeometry args={[bodyProps.armSize * 0.85, 0.22, 8, 16]} />
        </mesh>
        {/* Hand */}
        <mesh material={skinMaterial} position={[0.08, -0.55, 0.1]}>
          <sphereGeometry args={[bodyProps.armSize * 1.1, 12, 12]} />
        </mesh>
      </group>
    </group>
  );
});

Body.displayName = "Body";

export default Body;
