import { useRef, memo, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import HeadGeometry from "./parts/HeadGeometry";
import FacialFeatures from "./parts/FacialFeatures";
import HairStyles from "./parts/HairStyles";
import Accessories from "./parts/Accessories";
import FacialHair from "./parts/FacialHair";
import Body from "./parts/Body";

export interface AvatarConfig {
  // Colors
  skinColor: string;
  hairColor: string;
  eyeColor: string;
  
  // Hair style (expanded)
  hairStyle: "short" | "medium" | "long" | "curly" | "ponytail" | "mohawk" | "bald";
  
  // Face shape
  faceShape: "round" | "oval" | "square" | "heart";
  
  // Expression
  expression: "happy" | "neutral" | "surprised" | "wink";
  
  // Glasses
  hasGlasses: boolean;
  glassesStyle: "round" | "square" | "cat-eye" | "aviator";
  
  // Hat
  hasHat: boolean;
  hatStyle: "cap" | "beanie" | "cowboy" | "none";
  
  // Earrings
  hasEarrings: boolean;
  
  // Facial hair
  hasFacialHair: boolean;
  facialHairStyle: "beard" | "goatee" | "mustache" | "stubble" | "none";
  
  // Body style
  bodyStyle: "slim" | "average" | "athletic";
}

interface AvatarModelProps {
  config: AvatarConfig;
  autoRotate?: boolean;
  animated?: boolean;
}

const AvatarModel = memo(({ config, autoRotate = false, animated = false }: AvatarModelProps) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (autoRotate && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.5;
    }
  });

  // Memoize materials to prevent recreating every frame
  const skinMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: config.skinColor,
    roughness: 0.5,
    metalness: 0.05,
  }), [config.skinColor]);

  const hairMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: config.hairColor,
    roughness: 0.7,
    metalness: 0,
  }), [config.hairColor]);

  const eyeMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: config.eyeColor,
    roughness: 0.25,
    metalness: 0.15,
  }), [config.eyeColor]);

  return (
    <group ref={groupRef} position={[0, -0.6, 0]}>
      {/* Head with face shape - cartoon proportions */}
      <HeadGeometry config={config} skinMaterial={skinMaterial} />
      
      {/* Facial features (eyes, nose, mouth, eyebrows) - cartoon style */}
      <FacialFeatures 
        config={config} 
        skinMaterial={skinMaterial} 
        eyeMaterial={eyeMaterial}
        hairMaterial={hairMaterial}
        animated={animated}
      />
      
      {/* Hair - more volume */}
      <HairStyles 
        config={config} 
        hairMaterial={hairMaterial}
        hasHat={config.hasHat}
      />
      
      {/* Accessories (glasses, hat, earrings) */}
      <Accessories config={config} />
      
      {/* Facial hair */}
      <FacialHair config={config} hairMaterial={hairMaterial} />
      
      {/* Body - cartoon proportions */}
      <Body config={config} skinMaterial={skinMaterial} animated={animated} />
    </group>
  );
});

AvatarModel.displayName = "AvatarModel";

export default AvatarModel;
