import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export interface AvatarConfig {
  skinColor: string;
  hairColor: string;
  eyeColor: string;
  hairStyle: "short" | "medium" | "long" | "bald";
  hasGlasses: boolean;
}

interface AvatarModelProps {
  config: AvatarConfig;
  autoRotate?: boolean;
}

const AvatarModel = ({ config, autoRotate = false }: AvatarModelProps) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (autoRotate && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.5;
    }
  });

  const skinMaterial = new THREE.MeshStandardMaterial({
    color: config.skinColor,
    roughness: 0.6,
    metalness: 0.1,
  });

  const hairMaterial = new THREE.MeshStandardMaterial({
    color: config.hairColor,
    roughness: 0.8,
    metalness: 0,
  });

  const eyeMaterial = new THREE.MeshStandardMaterial({
    color: config.eyeColor,
    roughness: 0.3,
    metalness: 0.2,
  });

  const whiteMaterial = new THREE.MeshStandardMaterial({
    color: "#ffffff",
    roughness: 0.3,
    metalness: 0,
  });

  const glassesMaterial = new THREE.MeshStandardMaterial({
    color: "#1a1a2e",
    roughness: 0.2,
    metalness: 0.8,
  });

  return (
    <group ref={groupRef} position={[0, -0.5, 0]}>
      {/* Head */}
      <mesh material={skinMaterial} position={[0, 1.5, 0]}>
        <sphereGeometry args={[0.8, 32, 32]} />
      </mesh>

      {/* Body */}
      <mesh material={skinMaterial} position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.5, 0.6, 1.2, 32]} />
      </mesh>

      {/* Neck */}
      <mesh material={skinMaterial} position={[0, 0.95, 0]}>
        <cylinderGeometry args={[0.25, 0.3, 0.3, 32]} />
      </mesh>

      {/* Shoulders */}
      <mesh material={skinMaterial} position={[0, 0.7, 0]}>
        <capsuleGeometry args={[0.2, 1.2, 8, 16]} />
        <meshStandardMaterial color={config.skinColor} roughness={0.6} />
      </mesh>

      {/* Eyes - White */}
      <mesh material={whiteMaterial} position={[-0.25, 1.55, 0.65]}>
        <sphereGeometry args={[0.15, 16, 16]} />
      </mesh>
      <mesh material={whiteMaterial} position={[0.25, 1.55, 0.65]}>
        <sphereGeometry args={[0.15, 16, 16]} />
      </mesh>

      {/* Eyes - Iris */}
      <mesh material={eyeMaterial} position={[-0.25, 1.55, 0.75]}>
        <sphereGeometry args={[0.08, 16, 16]} />
      </mesh>
      <mesh material={eyeMaterial} position={[0.25, 1.55, 0.75]}>
        <sphereGeometry args={[0.08, 16, 16]} />
      </mesh>

      {/* Eyes - Pupils */}
      <mesh position={[-0.25, 1.55, 0.8]}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      <mesh position={[0.25, 1.55, 0.8]}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshStandardMaterial color="#000000" />
      </mesh>

      {/* Eyebrows */}
      <mesh material={hairMaterial} position={[-0.25, 1.75, 0.65]} rotation={[0, 0, 0.1]}>
        <boxGeometry args={[0.25, 0.05, 0.08]} />
      </mesh>
      <mesh material={hairMaterial} position={[0.25, 1.75, 0.65]} rotation={[0, 0, -0.1]}>
        <boxGeometry args={[0.25, 0.05, 0.08]} />
      </mesh>

      {/* Nose */}
      <mesh material={skinMaterial} position={[0, 1.4, 0.75]}>
        <coneGeometry args={[0.08, 0.2, 8]} />
      </mesh>

      {/* Mouth */}
      <mesh position={[0, 1.2, 0.72]}>
        <capsuleGeometry args={[0.03, 0.15, 4, 8]} />
        <meshStandardMaterial color="#c44569" roughness={0.5} />
      </mesh>

      {/* Ears */}
      <mesh material={skinMaterial} position={[-0.75, 1.5, 0]}>
        <sphereGeometry args={[0.12, 16, 16]} />
      </mesh>
      <mesh material={skinMaterial} position={[0.75, 1.5, 0]}>
        <sphereGeometry args={[0.12, 16, 16]} />
      </mesh>

      {/* Hair */}
      {config.hairStyle !== "bald" && (
        <group>
          {/* Base hair */}
          <mesh material={hairMaterial} position={[0, 1.85, -0.1]}>
            <sphereGeometry args={[0.75, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
          </mesh>

          {config.hairStyle === "medium" && (
            <>
              <mesh material={hairMaterial} position={[-0.6, 1.4, -0.2]}>
                <sphereGeometry args={[0.3, 16, 16]} />
              </mesh>
              <mesh material={hairMaterial} position={[0.6, 1.4, -0.2]}>
                <sphereGeometry args={[0.3, 16, 16]} />
              </mesh>
            </>
          )}

          {config.hairStyle === "long" && (
            <>
              <mesh material={hairMaterial} position={[-0.65, 1.2, -0.15]}>
                <capsuleGeometry args={[0.25, 0.8, 8, 16]} />
              </mesh>
              <mesh material={hairMaterial} position={[0.65, 1.2, -0.15]}>
                <capsuleGeometry args={[0.25, 0.8, 8, 16]} />
              </mesh>
              <mesh material={hairMaterial} position={[0, 1.0, -0.5]}>
                <capsuleGeometry args={[0.4, 0.6, 8, 16]} />
              </mesh>
            </>
          )}
        </group>
      )}

      {/* Glasses */}
      {config.hasGlasses && (
        <group position={[0, 1.55, 0.7]}>
          {/* Frame left */}
          <mesh material={glassesMaterial} position={[-0.28, 0, 0.08]}>
            <torusGeometry args={[0.18, 0.025, 8, 32]} />
          </mesh>
          {/* Frame right */}
          <mesh material={glassesMaterial} position={[0.28, 0, 0.08]}>
            <torusGeometry args={[0.18, 0.025, 8, 32]} />
          </mesh>
          {/* Bridge */}
          <mesh material={glassesMaterial} position={[0, 0, 0.1]}>
            <boxGeometry args={[0.12, 0.03, 0.03]} />
          </mesh>
          {/* Left arm */}
          <mesh material={glassesMaterial} position={[-0.48, 0, -0.1]} rotation={[0, -0.3, 0]}>
            <boxGeometry args={[0.4, 0.03, 0.03]} />
          </mesh>
          {/* Right arm */}
          <mesh material={glassesMaterial} position={[0.48, 0, -0.1]} rotation={[0, 0.3, 0]}>
            <boxGeometry args={[0.4, 0.03, 0.03]} />
          </mesh>
        </group>
      )}
    </group>
  );
};

export default AvatarModel;
