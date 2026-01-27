import { memo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { AvatarConfig } from "../AvatarModel";

interface FacialFeaturesProps {
  config: AvatarConfig;
  skinMaterial: THREE.MeshStandardMaterial;
  eyeMaterial: THREE.MeshStandardMaterial;
  hairMaterial: THREE.MeshStandardMaterial;
  animated?: boolean;
}

const FacialFeatures = memo(({ config, skinMaterial, eyeMaterial, hairMaterial, animated = false }: FacialFeaturesProps) => {
  const leftEyeRef = useRef<THREE.Group>(null);
  const rightEyeRef = useRef<THREE.Group>(null);
  

  // Blink animation
  useFrame((state) => {
    if (!animated) return;
    
    const time = state.clock.elapsedTime;
    // Blink every 3-5 seconds
    const blinkCycle = Math.sin(time * 0.5) > 0.95;
    
    if (leftEyeRef.current && rightEyeRef.current) {
      const blinkScale = blinkCycle ? 0.1 : 1;
      leftEyeRef.current.scale.y = THREE.MathUtils.lerp(leftEyeRef.current.scale.y, blinkScale, 0.3);
      rightEyeRef.current.scale.y = THREE.MathUtils.lerp(rightEyeRef.current.scale.y, blinkScale, 0.3);
    }
  });

  const whiteMaterial = new THREE.MeshStandardMaterial({
    color: "#ffffff",
    roughness: 0.3,
    metalness: 0,
  });

  const pupilMaterial = new THREE.MeshStandardMaterial({
    color: "#000000",
    roughness: 0.2,
    metalness: 0.1,
  });

  const lipMaterial = new THREE.MeshStandardMaterial({
    color: "#c44569",
    roughness: 0.5,
    metalness: 0,
  });

  // Eye positions based on expression
  const getEyeProps = () => {
    switch (config.expression) {
      case "happy":
        return { eyeScaleY: 0.9, pupilY: 0.02 };
      case "surprised":
        return { eyeScaleY: 1.2, pupilY: 0 };
      case "wink":
        return { eyeScaleY: 1, pupilY: 0, leftWink: true };
      default:
        return { eyeScaleY: 1, pupilY: 0 };
    }
  };

  // Mouth shape based on expression
  const getMouthProps = () => {
    switch (config.expression) {
      case "happy":
        return { type: "smile", rotation: Math.PI };
      case "surprised":
        return { type: "open", rotation: 0 };
      case "wink":
        return { type: "smirk", rotation: Math.PI };
      default:
        return { type: "neutral", rotation: 0 };
    }
  };

  // Eyebrow props based on expression
  const getEyebrowProps = () => {
    switch (config.expression) {
      case "happy":
        return { rotation: -0.1, y: 0.28 };
      case "surprised":
        return { rotation: 0.15, y: 0.32 };
      case "wink":
        return { rotation: -0.05, y: 0.28 };
      default:
        return { rotation: 0, y: 0.28 };
    }
  };

  const eyeProps = getEyeProps();
  const mouthProps = getMouthProps();
  const eyebrowProps = getEyebrowProps();

  return (
    <group position={[0, 1.5, 0]}>
      {/* Eyes */}
      <group ref={leftEyeRef} position={[-0.2, 0.05, 0.5]}>
        {/* Eye white */}
        <mesh material={whiteMaterial} scale={[1, eyeProps.eyeScaleY, 1]}>
          <sphereGeometry args={[0.12, 16, 16]} />
        </mesh>
        {/* Iris */}
        {!(eyeProps as any).leftWink && (
          <>
            <mesh material={eyeMaterial} position={[0, eyeProps.pupilY, 0.08]} scale={[1, eyeProps.eyeScaleY, 1]}>
              <sphereGeometry args={[0.07, 16, 16]} />
            </mesh>
            {/* Pupil */}
            <mesh material={pupilMaterial} position={[0, eyeProps.pupilY, 0.11]} scale={[1, eyeProps.eyeScaleY, 1]}>
              <sphereGeometry args={[0.035, 12, 12]} />
            </mesh>
            {/* Eye highlight */}
            <mesh position={[0.02, eyeProps.pupilY + 0.02, 0.13]} scale={[1, eyeProps.eyeScaleY, 1]}>
              <sphereGeometry args={[0.015, 8, 8]} />
              <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.5} />
            </mesh>
          </>
        )}
        {/* Wink line */}
        {(eyeProps as any).leftWink && (
          <mesh rotation={[0, 0, 0.1]}>
            <capsuleGeometry args={[0.02, 0.12, 4, 8]} />
            <meshStandardMaterial color={config.skinColor} />
          </mesh>
        )}
      </group>

      <group ref={rightEyeRef} position={[0.2, 0.05, 0.5]}>
        <mesh material={whiteMaterial} scale={[1, eyeProps.eyeScaleY, 1]}>
          <sphereGeometry args={[0.12, 16, 16]} />
        </mesh>
        <mesh material={eyeMaterial} position={[0, eyeProps.pupilY, 0.08]} scale={[1, eyeProps.eyeScaleY, 1]}>
          <sphereGeometry args={[0.07, 16, 16]} />
        </mesh>
        <mesh material={pupilMaterial} position={[0, eyeProps.pupilY, 0.11]} scale={[1, eyeProps.eyeScaleY, 1]}>
          <sphereGeometry args={[0.035, 12, 12]} />
        </mesh>
        <mesh position={[0.02, eyeProps.pupilY + 0.02, 0.13]} scale={[1, eyeProps.eyeScaleY, 1]}>
          <sphereGeometry args={[0.015, 8, 8]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.5} />
        </mesh>
      </group>

      {/* Eyebrows */}
      <mesh material={hairMaterial} position={[-0.2, eyebrowProps.y, 0.52]} rotation={[0, 0, eyebrowProps.rotation]}>
        <capsuleGeometry args={[0.025, 0.1, 4, 8]} />
      </mesh>
      <mesh material={hairMaterial} position={[0.2, eyebrowProps.y, 0.52]} rotation={[0, 0, -eyebrowProps.rotation]}>
        <capsuleGeometry args={[0.025, 0.1, 4, 8]} />
      </mesh>

      {/* Nose - more defined shape */}
      <group position={[0, -0.1, 0.55]}>
        {/* Nose bridge */}
        <mesh material={skinMaterial} position={[0, 0.1, -0.05]} scale={[0.5, 1, 0.5]}>
          <capsuleGeometry args={[0.03, 0.1, 4, 8]} />
        </mesh>
        {/* Nose tip */}
        <mesh material={skinMaterial}>
          <sphereGeometry args={[0.06, 12, 12]} />
        </mesh>
        {/* Nostrils */}
        <mesh material={skinMaterial} position={[-0.04, -0.02, 0]} scale={[0.6, 0.5, 0.6]}>
          <sphereGeometry args={[0.03, 8, 8]} />
        </mesh>
        <mesh material={skinMaterial} position={[0.04, -0.02, 0]} scale={[0.6, 0.5, 0.6]}>
          <sphereGeometry args={[0.03, 8, 8]} />
        </mesh>
      </group>

      {/* Mouth */}
      <group position={[0, -0.3, 0.5]}>
        {mouthProps.type === "smile" && (
          <mesh material={lipMaterial} rotation={[mouthProps.rotation, 0, 0]}>
            <torusGeometry args={[0.08, 0.025, 8, 16, Math.PI]} />
          </mesh>
        )}
        {mouthProps.type === "neutral" && (
          <mesh material={lipMaterial}>
            <capsuleGeometry args={[0.02, 0.1, 4, 8]} />
          </mesh>
        )}
        {mouthProps.type === "open" && (
          <mesh material={lipMaterial}>
            <sphereGeometry args={[0.06, 12, 12]} />
          </mesh>
        )}
        {mouthProps.type === "smirk" && (
          <group rotation={[0, 0, 0.15]}>
            <mesh material={lipMaterial} rotation={[Math.PI, 0, 0]}>
              <torusGeometry args={[0.06, 0.02, 8, 16, Math.PI]} />
            </mesh>
          </group>
        )}
      </group>
    </group>
  );
});

FacialFeatures.displayName = "FacialFeatures";

export default FacialFeatures;
