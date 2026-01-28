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
    roughness: 0.2,
    metalness: 0,
  });

  const pupilMaterial = new THREE.MeshStandardMaterial({
    color: "#1a1a1a",
    roughness: 0.1,
    metalness: 0,
  });

  const lipMaterial = new THREE.MeshStandardMaterial({
    color: "#e07070",
    roughness: 0.4,
    metalness: 0,
  });

  // Cartoon eye expressions - bigger and more expressive
  const getEyeProps = () => {
    switch (config.expression) {
      case "happy":
        return { eyeScaleY: 0.75, pupilY: 0.02, irisScale: 1.1 };
      case "surprised":
        return { eyeScaleY: 1.3, pupilY: 0, irisScale: 0.9 };
      case "wink":
        return { eyeScaleY: 1, pupilY: 0, leftWink: true, irisScale: 1 };
      default:
        return { eyeScaleY: 1, pupilY: 0, irisScale: 1 };
    }
  };

  // Cartoon mouth - bigger and more expressive
  const getMouthProps = () => {
    switch (config.expression) {
      case "happy":
        return { type: "bigSmile", rotation: Math.PI, scale: 1.3 };
      case "surprised":
        return { type: "open", rotation: 0, scale: 1.2 };
      case "wink":
        return { type: "smirk", rotation: Math.PI, scale: 1.1 };
      default:
        return { type: "neutral", rotation: 0, scale: 1 };
    }
  };

  // Expressive eyebrows
  const getEyebrowProps = () => {
    switch (config.expression) {
      case "happy":
        return { rotation: -0.15, y: 0.38, scale: 1.1 };
      case "surprised":
        return { rotation: 0.2, y: 0.45, scale: 1.2 };
      case "wink":
        return { rotation: -0.1, y: 0.38, scale: 1 };
      default:
        return { rotation: 0, y: 0.35, scale: 1 };
    }
  };

  const eyeProps = getEyeProps();
  const mouthProps = getMouthProps();
  const eyebrowProps = getEyebrowProps();

  return (
    <group position={[0, 1.6, 0]}>
      {/* CARTOON EYES - Much bigger */}
      <group ref={leftEyeRef} position={[-0.22, 0.08, 0.55]}>
        {/* Eye white - bigger */}
        <mesh material={whiteMaterial} scale={[1, eyeProps.eyeScaleY, 0.85]}>
          <sphereGeometry args={[0.18, 20, 20]} />
        </mesh>
        {/* Iris - bigger and more colorful */}
        {!(eyeProps as any).leftWink && (
          <>
            <mesh material={eyeMaterial} position={[0, eyeProps.pupilY, 0.1]} scale={[eyeProps.irisScale, eyeProps.eyeScaleY * eyeProps.irisScale, 1]}>
              <sphereGeometry args={[0.11, 20, 20]} />
            </mesh>
            {/* Pupil - bigger */}
            <mesh material={pupilMaterial} position={[0, eyeProps.pupilY, 0.14]} scale={[1, eyeProps.eyeScaleY, 1]}>
              <sphereGeometry args={[0.055, 16, 16]} />
            </mesh>
            {/* Main highlight - bigger and brighter */}
            <mesh position={[0.04, eyeProps.pupilY + 0.04, 0.17]} scale={[1, eyeProps.eyeScaleY, 1]}>
              <sphereGeometry args={[0.035, 10, 10]} />
              <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.8} />
            </mesh>
            {/* Secondary highlight - anime sparkle */}
            <mesh position={[-0.03, eyeProps.pupilY - 0.02, 0.16]} scale={[1, eyeProps.eyeScaleY, 1]}>
              <sphereGeometry args={[0.018, 8, 8]} />
              <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.6} />
            </mesh>
          </>
        )}
        {/* Wink - cute curved line */}
        {(eyeProps as any).leftWink && (
          <mesh rotation={[0, 0, 0.1]}>
            <torusGeometry args={[0.1, 0.025, 8, 16, Math.PI]} />
            <meshStandardMaterial color={config.skinColor} />
          </mesh>
        )}
      </group>

      <group ref={rightEyeRef} position={[0.22, 0.08, 0.55]}>
        <mesh material={whiteMaterial} scale={[1, eyeProps.eyeScaleY, 0.85]}>
          <sphereGeometry args={[0.18, 20, 20]} />
        </mesh>
        <mesh material={eyeMaterial} position={[0, eyeProps.pupilY, 0.1]} scale={[eyeProps.irisScale, eyeProps.eyeScaleY * eyeProps.irisScale, 1]}>
          <sphereGeometry args={[0.11, 20, 20]} />
        </mesh>
        <mesh material={pupilMaterial} position={[0, eyeProps.pupilY, 0.14]} scale={[1, eyeProps.eyeScaleY, 1]}>
          <sphereGeometry args={[0.055, 16, 16]} />
        </mesh>
        <mesh position={[0.04, eyeProps.pupilY + 0.04, 0.17]} scale={[1, eyeProps.eyeScaleY, 1]}>
          <sphereGeometry args={[0.035, 10, 10]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.8} />
        </mesh>
        <mesh position={[-0.03, eyeProps.pupilY - 0.02, 0.16]} scale={[1, eyeProps.eyeScaleY, 1]}>
          <sphereGeometry args={[0.018, 8, 8]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.6} />
        </mesh>
      </group>

      {/* CARTOON EYEBROWS - Thicker and more expressive */}
      <mesh material={hairMaterial} position={[-0.22, eyebrowProps.y, 0.58]} rotation={[0, 0, eyebrowProps.rotation]} scale={[eyebrowProps.scale, 1, 1]}>
        <capsuleGeometry args={[0.035, 0.12, 6, 10]} />
      </mesh>
      <mesh material={hairMaterial} position={[0.22, eyebrowProps.y, 0.58]} rotation={[0, 0, -eyebrowProps.rotation]} scale={[eyebrowProps.scale, 1, 1]}>
        <capsuleGeometry args={[0.035, 0.12, 6, 10]} />
      </mesh>

      {/* CARTOON NOSE - Simple and cute */}
      <group position={[0, -0.08, 0.62]}>
        {/* Simple round nose tip */}
        <mesh material={skinMaterial}>
          <sphereGeometry args={[0.07, 12, 12]} />
        </mesh>
      </group>

      {/* CARTOON MOUTH - Bigger and more expressive */}
      <group position={[0, -0.3, 0.55]} scale={[mouthProps.scale, mouthProps.scale, 1]}>
        {mouthProps.type === "bigSmile" && (
          <>
            {/* Big happy smile */}
            <mesh material={lipMaterial} rotation={[mouthProps.rotation, 0, 0]}>
              <torusGeometry args={[0.1, 0.03, 10, 20, Math.PI]} />
            </mesh>
            {/* Teeth showing */}
            <mesh position={[0, 0.02, 0.01]}>
              <boxGeometry args={[0.12, 0.04, 0.02]} />
              <meshStandardMaterial color="#ffffff" />
            </mesh>
          </>
        )}
        {mouthProps.type === "neutral" && (
          <mesh material={lipMaterial}>
            <capsuleGeometry args={[0.025, 0.08, 6, 10]} />
          </mesh>
        )}
        {mouthProps.type === "open" && (
          <>
            {/* Surprised O mouth */}
            <mesh material={lipMaterial}>
              <torusGeometry args={[0.07, 0.025, 10, 20]} />
            </mesh>
            {/* Dark inside */}
            <mesh position={[0, 0, -0.01]}>
              <circleGeometry args={[0.05, 16]} />
              <meshStandardMaterial color="#3d1f1f" />
            </mesh>
          </>
        )}
        {mouthProps.type === "smirk" && (
          <group rotation={[0, 0, 0.2]}>
            <mesh material={lipMaterial} rotation={[Math.PI, 0, 0]}>
              <torusGeometry args={[0.08, 0.025, 10, 20, Math.PI]} />
            </mesh>
          </group>
        )}
      </group>

      {/* Blush marks for extra cartoon cuteness (on happy expression) */}
      {config.expression === "happy" && (
        <>
          <mesh position={[-0.4, -0.05, 0.5]}>
            <circleGeometry args={[0.08, 16]} />
            <meshStandardMaterial color="#ffb0b0" transparent opacity={0.4} />
          </mesh>
          <mesh position={[0.4, -0.05, 0.5]}>
            <circleGeometry args={[0.08, 16]} />
            <meshStandardMaterial color="#ffb0b0" transparent opacity={0.4} />
          </mesh>
        </>
      )}
    </group>
  );
});

FacialFeatures.displayName = "FacialFeatures";

export default FacialFeatures;
