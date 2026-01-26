import { useRef, memo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { AvatarConfig } from "@/components/avatar/AvatarModel";
import ARMessageSign from "./ARMessageSign";

interface ARAvatarWithSignProps {
  config: AvatarConfig;
  message: string;
}

const ARAvatarWithSign = memo(({ config, message }: ARAvatarWithSignProps) => {
  const groupRef = useRef<THREE.Group>(null);

  // Floating animation
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.1;
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
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
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Head */}
      <mesh material={skinMaterial} position={[0, 1.5, 0]}>
        <sphereGeometry args={[0.6, 32, 32]} />
      </mesh>

      {/* Body */}
      <mesh material={skinMaterial} position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.4, 0.5, 1, 32]} />
      </mesh>

      {/* Neck */}
      <mesh material={skinMaterial} position={[0, 1.0, 0]}>
        <cylinderGeometry args={[0.2, 0.25, 0.2, 32]} />
      </mesh>

      {/* Left Arm - Extended to hold sign */}
      <group position={[-0.55, 0.7, 0.3]} rotation={[0.3, 0, 0.5]}>
        <mesh material={skinMaterial}>
          <capsuleGeometry args={[0.1, 0.5, 8, 16]} />
        </mesh>
        {/* Forearm */}
        <group position={[0, -0.4, 0.2]} rotation={[-0.8, 0, 0]}>
          <mesh material={skinMaterial}>
            <capsuleGeometry args={[0.08, 0.4, 8, 16]} />
          </mesh>
        </group>
      </group>

      {/* Right Arm - Extended to hold sign */}
      <group position={[0.55, 0.7, 0.3]} rotation={[0.3, 0, -0.5]}>
        <mesh material={skinMaterial}>
          <capsuleGeometry args={[0.1, 0.5, 8, 16]} />
        </mesh>
        {/* Forearm */}
        <group position={[0, -0.4, 0.2]} rotation={[-0.8, 0, 0]}>
          <mesh material={skinMaterial}>
            <capsuleGeometry args={[0.08, 0.4, 8, 16]} />
          </mesh>
        </group>
      </group>

      {/* Eyes - White */}
      <mesh material={whiteMaterial} position={[-0.18, 1.55, 0.5]}>
        <sphereGeometry args={[0.12, 16, 16]} />
      </mesh>
      <mesh material={whiteMaterial} position={[0.18, 1.55, 0.5]}>
        <sphereGeometry args={[0.12, 16, 16]} />
      </mesh>

      {/* Eyes - Iris */}
      <mesh material={eyeMaterial} position={[-0.18, 1.55, 0.58]}>
        <sphereGeometry args={[0.06, 16, 16]} />
      </mesh>
      <mesh material={eyeMaterial} position={[0.18, 1.55, 0.58]}>
        <sphereGeometry args={[0.06, 16, 16]} />
      </mesh>

      {/* Eyes - Pupils */}
      <mesh position={[-0.18, 1.55, 0.62]}>
        <sphereGeometry args={[0.03, 16, 16]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      <mesh position={[0.18, 1.55, 0.62]}>
        <sphereGeometry args={[0.03, 16, 16]} />
        <meshStandardMaterial color="#000000" />
      </mesh>

      {/* Eyebrows */}
      <mesh material={hairMaterial} position={[-0.18, 1.72, 0.5]} rotation={[0, 0, 0.1]}>
        <boxGeometry args={[0.2, 0.04, 0.06]} />
      </mesh>
      <mesh material={hairMaterial} position={[0.18, 1.72, 0.5]} rotation={[0, 0, -0.1]}>
        <boxGeometry args={[0.2, 0.04, 0.06]} />
      </mesh>

      {/* Nose */}
      <mesh material={skinMaterial} position={[0, 1.4, 0.55]}>
        <coneGeometry args={[0.06, 0.15, 8]} />
      </mesh>

      {/* Mouth - Smile */}
      <mesh position={[0, 1.25, 0.55]}>
        <torusGeometry args={[0.08, 0.02, 8, 16, Math.PI]} />
        <meshStandardMaterial color="#c44569" roughness={0.5} />
      </mesh>

      {/* Ears */}
      <mesh material={skinMaterial} position={[-0.58, 1.5, 0]}>
        <sphereGeometry args={[0.1, 16, 16]} />
      </mesh>
      <mesh material={skinMaterial} position={[0.58, 1.5, 0]}>
        <sphereGeometry args={[0.1, 16, 16]} />
      </mesh>

      {/* Hair */}
      {config.hairStyle !== "bald" && (
        <group>
          <mesh material={hairMaterial} position={[0, 1.85, -0.1]}>
            <sphereGeometry args={[0.55, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
          </mesh>

          {config.hairStyle === "medium" && (
            <>
              <mesh material={hairMaterial} position={[-0.45, 1.4, -0.15]}>
                <sphereGeometry args={[0.22, 16, 16]} />
              </mesh>
              <mesh material={hairMaterial} position={[0.45, 1.4, -0.15]}>
                <sphereGeometry args={[0.22, 16, 16]} />
              </mesh>
            </>
          )}

          {config.hairStyle === "long" && (
            <>
              <mesh material={hairMaterial} position={[-0.5, 1.2, -0.1]}>
                <capsuleGeometry args={[0.2, 0.6, 8, 16]} />
              </mesh>
              <mesh material={hairMaterial} position={[0.5, 1.2, -0.1]}>
                <capsuleGeometry args={[0.2, 0.6, 8, 16]} />
              </mesh>
              <mesh material={hairMaterial} position={[0, 1.0, -0.4]}>
                <capsuleGeometry args={[0.3, 0.5, 8, 16]} />
              </mesh>
            </>
          )}
        </group>
      )}

      {/* Glasses */}
      {config.hasGlasses && (
        <group position={[0, 1.55, 0.55]}>
          <mesh material={glassesMaterial} position={[-0.2, 0, 0.06]}>
            <torusGeometry args={[0.14, 0.02, 8, 32]} />
          </mesh>
          <mesh material={glassesMaterial} position={[0.2, 0, 0.06]}>
            <torusGeometry args={[0.14, 0.02, 8, 32]} />
          </mesh>
          <mesh material={glassesMaterial} position={[0, 0, 0.08]}>
            <boxGeometry args={[0.1, 0.02, 0.02]} />
          </mesh>
          <mesh material={glassesMaterial} position={[-0.38, 0, -0.08]} rotation={[0, -0.3, 0]}>
            <boxGeometry args={[0.3, 0.02, 0.02]} />
          </mesh>
          <mesh material={glassesMaterial} position={[0.38, 0, -0.08]} rotation={[0, 0.3, 0]}>
            <boxGeometry args={[0.3, 0.02, 0.02]} />
          </mesh>
        </group>
      )}

      {/* Message Sign */}
      <ARMessageSign message={message} />
    </group>
  );
});

ARAvatarWithSign.displayName = "ARAvatarWithSign";

export default ARAvatarWithSign;
