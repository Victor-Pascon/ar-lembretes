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
    
    const breathe = Math.sin(state.clock.elapsedTime * 1.5) * 0.015;
    bodyRef.current.scale.x = 1 + breathe;
    bodyRef.current.scale.z = 1 + breathe * 0.5;
  });

  // Cartoon body proportions - smaller body relative to head
  const getBodyProps = () => {
    switch (config.bodyStyle) {
      case "slim":
        return {
          torsoWidth: 0.28,
          torsoWidthBottom: 0.32,
          shoulderWidth: 0.7,
          shoulderSize: 0.12,
          armSize: 0.07,
        };
      case "athletic":
        return {
          torsoWidth: 0.38,
          torsoWidthBottom: 0.42,
          shoulderWidth: 0.95,
          shoulderSize: 0.18,
          armSize: 0.1,
        };
      case "average":
      default:
        return {
          torsoWidth: 0.32,
          torsoWidthBottom: 0.38,
          shoulderWidth: 0.82,
          shoulderSize: 0.15,
          armSize: 0.08,
        };
    }
  };

  const shirtMaterial = new THREE.MeshStandardMaterial({
    color: "#6366f1",
    roughness: 0.7,
    metalness: 0,
  });

  // Outline material
  const outlineMaterial = new THREE.MeshBasicMaterial({
    color: "#2d2d2d",
    side: THREE.BackSide,
  });

  const bodyProps = getBodyProps();

  return (
    <group ref={bodyRef}>
      {/* Neck - shorter for cartoon style */}
      <mesh material={skinMaterial} position={[0, 1.0, 0]}>
        <cylinderGeometry args={[0.12, 0.15, 0.12, 16]} />
      </mesh>

      {/* Upper body outline */}
      <mesh material={outlineMaterial} position={[0, 0.55, 0]} scale={[1.03, 1.03, 1.03]}>
        <cylinderGeometry args={[bodyProps.torsoWidth, bodyProps.torsoWidthBottom, 0.7, 16]} />
      </mesh>

      {/* Upper body / Torso with shirt - shorter */}
      <mesh material={shirtMaterial} position={[0, 0.55, 0]}>
        <cylinderGeometry args={[bodyProps.torsoWidth, bodyProps.torsoWidthBottom, 0.7, 16]} />
      </mesh>

      {/* Shirt collar - rounded */}
      <mesh material={shirtMaterial} position={[0, 0.92, 0]}>
        <torusGeometry args={[0.15, 0.04, 8, 16]} />
      </mesh>

      {/* Shoulders - rounder */}
      <mesh material={shirtMaterial} position={[0, 0.8, 0]} rotation={[0, 0, Math.PI / 2]}>
        <capsuleGeometry args={[bodyProps.shoulderSize, bodyProps.shoulderWidth, 10, 18]} />
      </mesh>

      {/* Arms - cartoon style, shorter and rounder */}
      {/* Left arm */}
      <group position={[-0.45, 0.62, 0]}>
        {/* Upper arm */}
        <mesh material={shirtMaterial} rotation={[0, 0, 0.2]}>
          <capsuleGeometry args={[bodyProps.armSize, 0.18, 10, 16]} />
        </mesh>
        {/* Lower arm (skin) - rounder */}
        <mesh material={skinMaterial} position={[-0.05, -0.28, 0.04]} rotation={[0.15, 0, 0.15]}>
          <capsuleGeometry args={[bodyProps.armSize * 0.9, 0.16, 10, 16]} />
        </mesh>
        {/* Hand - cartoon mitt style */}
        <group position={[-0.08, -0.45, 0.08]}>
          <mesh material={skinMaterial}>
            <sphereGeometry args={[bodyProps.armSize * 1.4, 14, 14]} />
          </mesh>
          {/* Thumb */}
          <mesh material={skinMaterial} position={[0.06, 0.02, 0.04]} rotation={[0, 0, -0.5]}>
            <capsuleGeometry args={[0.025, 0.04, 6, 8]} />
          </mesh>
        </group>
      </group>

      {/* Right arm */}
      <group position={[0.45, 0.62, 0]}>
        {/* Upper arm */}
        <mesh material={shirtMaterial} rotation={[0, 0, -0.2]}>
          <capsuleGeometry args={[bodyProps.armSize, 0.18, 10, 16]} />
        </mesh>
        {/* Lower arm (skin) */}
        <mesh material={skinMaterial} position={[0.05, -0.28, 0.04]} rotation={[0.15, 0, -0.15]}>
          <capsuleGeometry args={[bodyProps.armSize * 0.9, 0.16, 10, 16]} />
        </mesh>
        {/* Hand - cartoon mitt style */}
        <group position={[0.08, -0.45, 0.08]}>
          <mesh material={skinMaterial}>
            <sphereGeometry args={[bodyProps.armSize * 1.4, 14, 14]} />
          </mesh>
          {/* Thumb */}
          <mesh material={skinMaterial} position={[-0.06, 0.02, 0.04]} rotation={[0, 0, 0.5]}>
            <capsuleGeometry args={[0.025, 0.04, 6, 8]} />
          </mesh>
        </group>
      </group>
    </group>
  );
});

Body.displayName = "Body";

export default Body;
