import { useRef, memo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { AvatarConfig } from "@/components/avatar/AvatarModel";
import HeadGeometry from "@/components/avatar/parts/HeadGeometry";
import FacialFeatures from "@/components/avatar/parts/FacialFeatures";
import HairStyles from "@/components/avatar/parts/HairStyles";
import Accessories from "@/components/avatar/parts/Accessories";
import FacialHair from "@/components/avatar/parts/FacialHair";
import ARMessageSign from "./ARMessageSign";

interface ARAvatarWithSignProps {
  config: AvatarConfig;
  message: string;
}

const ARAvatarWithSign = memo(({ config, message }: ARAvatarWithSignProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Group>(null);

  // Floating and breathing animation
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.1;
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
    
    // Breathing animation for body
    if (bodyRef.current) {
      const breathe = Math.sin(state.clock.elapsedTime * 1.5) * 0.02;
      bodyRef.current.scale.x = 1 + breathe;
      bodyRef.current.scale.z = 1 + breathe * 0.5;
    }
  });

  // Create materials
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

  const shirtMaterial = new THREE.MeshStandardMaterial({
    color: "#6366f1",
    roughness: 0.8,
    metalness: 0,
  });

  // Body proportions based on style
  const getBodyProps = () => {
    switch (config.bodyStyle) {
      case "slim":
        return { torsoWidth: 0.3, shoulderWidth: 0.8, armSize: 0.07 };
      case "athletic":
        return { torsoWidth: 0.4, shoulderWidth: 1.1, armSize: 0.1 };
      default:
        return { torsoWidth: 0.35, shoulderWidth: 0.95, armSize: 0.08 };
    }
  };

  const bodyProps = getBodyProps();

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Head with modular parts */}
      <HeadGeometry config={config} skinMaterial={skinMaterial} />
      
      {/* Facial features with animations */}
      <FacialFeatures 
        config={config} 
        skinMaterial={skinMaterial} 
        eyeMaterial={eyeMaterial}
        hairMaterial={hairMaterial}
        animated={true}
      />
      
      {/* Hair */}
      <HairStyles 
        config={config} 
        hairMaterial={hairMaterial}
        hasHat={config.hasHat}
      />
      
      {/* Accessories (glasses, hat, earrings) */}
      <Accessories config={config} />
      
      {/* Facial hair */}
      <FacialHair config={config} hairMaterial={hairMaterial} />

      {/* Body with arms holding sign */}
      <group ref={bodyRef}>
        {/* Neck */}
        <mesh material={skinMaterial} position={[0, 0.95, 0]}>
          <cylinderGeometry args={[0.12, 0.15, 0.15, 16]} />
        </mesh>

        {/* Upper body / Torso */}
        <mesh material={shirtMaterial} position={[0, 0.45, 0]}>
          <cylinderGeometry args={[bodyProps.torsoWidth, bodyProps.torsoWidth + 0.08, 0.85, 16]} />
        </mesh>

        {/* Shirt collar */}
        <mesh material={shirtMaterial} position={[0, 0.85, 0]}>
          <cylinderGeometry args={[0.16, 0.18, 0.06, 16]} />
        </mesh>

        {/* Collar V-neck */}
        <mesh material={skinMaterial} position={[0, 0.8, 0.15]} rotation={[-0.3, 0, 0]}>
          <coneGeometry args={[0.06, 0.1, 3]} />
        </mesh>

        {/* Shoulders */}
        <mesh material={shirtMaterial} position={[0, 0.72, 0]} rotation={[0, 0, Math.PI / 2]}>
          <capsuleGeometry args={[0.14, bodyProps.shoulderWidth, 8, 16]} />
        </mesh>

        {/* Left Arm - Extended to hold sign */}
        <group position={[-0.5, 0.6, 0.2]} rotation={[0.5, 0, 0.4]}>
          {/* Upper arm */}
          <mesh material={shirtMaterial}>
            <capsuleGeometry args={[bodyProps.armSize, 0.22, 8, 16]} />
          </mesh>
          {/* Forearm */}
          <group position={[0, -0.32, 0.15]} rotation={[-0.9, 0, 0]}>
            <mesh material={skinMaterial}>
              <capsuleGeometry args={[bodyProps.armSize * 0.85, 0.2, 8, 16]} />
            </mesh>
            {/* Hand */}
            <mesh material={skinMaterial} position={[0, -0.18, 0]}>
              <sphereGeometry args={[bodyProps.armSize * 1.2, 12, 12]} />
            </mesh>
          </group>
        </group>

        {/* Right Arm - Extended to hold sign */}
        <group position={[0.5, 0.6, 0.2]} rotation={[0.5, 0, -0.4]}>
          {/* Upper arm */}
          <mesh material={shirtMaterial}>
            <capsuleGeometry args={[bodyProps.armSize, 0.22, 8, 16]} />
          </mesh>
          {/* Forearm */}
          <group position={[0, -0.32, 0.15]} rotation={[-0.9, 0, 0]}>
            <mesh material={skinMaterial}>
              <capsuleGeometry args={[bodyProps.armSize * 0.85, 0.2, 8, 16]} />
            </mesh>
            {/* Hand */}
            <mesh material={skinMaterial} position={[0, -0.18, 0]}>
              <sphereGeometry args={[bodyProps.armSize * 1.2, 12, 12]} />
            </mesh>
          </group>
        </group>
      </group>

      {/* Message Sign */}
      <ARMessageSign message={message} />
    </group>
  );
});

ARAvatarWithSign.displayName = "ARAvatarWithSign";

export default ARAvatarWithSign;
