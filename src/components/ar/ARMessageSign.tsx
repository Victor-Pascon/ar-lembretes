import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, RoundedBox } from "@react-three/drei";
import * as THREE from "three";

interface ARMessageSignProps {
  message: string;
  maxWidth?: number;
}

const ARMessageSign = ({ message, maxWidth = 2.5 }: ARMessageSignProps) => {
  const groupRef = useRef<THREE.Group>(null);

  // Subtle swaying animation
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.02;
    }
  });

  // Calculate sign dimensions based on message length
  const lines = message.split('\n');
  const longestLine = lines.reduce((a, b) => a.length > b.length ? a : b, '');
  const estimatedWidth = Math.min(Math.max(longestLine.length * 0.12, 1.5), maxWidth);
  const estimatedHeight = Math.max(lines.length * 0.3 + 0.4, 0.8);

  return (
    <group ref={groupRef} position={[0, -0.3, 0.5]}>
      {/* Sign board */}
      <RoundedBox
        args={[estimatedWidth + 0.3, estimatedHeight + 0.2, 0.1]}
        radius={0.05}
        smoothness={4}
        position={[0, 0, -0.05]}
      >
        <meshStandardMaterial color="#ffffff" roughness={0.3} metalness={0.1} />
      </RoundedBox>

      {/* Sign border/frame */}
      <RoundedBox
        args={[estimatedWidth + 0.4, estimatedHeight + 0.3, 0.08]}
        radius={0.06}
        smoothness={4}
        position={[0, 0, -0.1]}
      >
        <meshStandardMaterial color="#7c3aed" roughness={0.4} metalness={0.2} />
      </RoundedBox>

      {/* Message text */}
      <Text
        position={[0, 0, 0.01]}
        fontSize={0.15}
        maxWidth={estimatedWidth}
        textAlign="center"
        anchorX="center"
        anchorY="middle"
        color="#1a1a2e"
      >
        {message}
      </Text>

      {/* Wooden pole/handle */}
      <mesh position={[0, -(estimatedHeight / 2 + 0.4), -0.05]}>
        <cylinderGeometry args={[0.04, 0.05, 0.6, 8]} />
        <meshStandardMaterial color="#8B4513" roughness={0.8} />
      </mesh>
    </group>
  );
};

export default ARMessageSign;
