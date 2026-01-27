import { memo } from "react";
import * as THREE from "three";
import { AvatarConfig } from "../AvatarModel";

interface AccessoriesProps {
  config: AvatarConfig;
}

const Accessories = memo(({ config }: AccessoriesProps) => {
  const glassesMaterial = new THREE.MeshStandardMaterial({
    color: "#1a1a2e",
    roughness: 0.2,
    metalness: 0.8,
  });

  const lensMaterial = new THREE.MeshStandardMaterial({
    color: "#88ccff",
    roughness: 0.1,
    metalness: 0.3,
    transparent: true,
    opacity: 0.3,
  });

  const goldMaterial = new THREE.MeshStandardMaterial({
    color: "#ffd700",
    roughness: 0.3,
    metalness: 0.9,
  });

  const renderRoundGlasses = () => (
    <group position={[0, 1.55, 0.55]}>
      {/* Left frame */}
      <mesh material={glassesMaterial} position={[-0.2, 0, 0]}>
        <torusGeometry args={[0.14, 0.02, 8, 32]} />
      </mesh>
      <mesh material={lensMaterial} position={[-0.2, 0, 0]}>
        <circleGeometry args={[0.12, 32]} />
      </mesh>
      {/* Right frame */}
      <mesh material={glassesMaterial} position={[0.2, 0, 0]}>
        <torusGeometry args={[0.14, 0.02, 8, 32]} />
      </mesh>
      <mesh material={lensMaterial} position={[0.2, 0, 0]}>
        <circleGeometry args={[0.12, 32]} />
      </mesh>
      {/* Bridge */}
      <mesh material={glassesMaterial} position={[0, 0, 0.02]}>
        <boxGeometry args={[0.08, 0.02, 0.02]} />
      </mesh>
      {/* Arms */}
      <mesh material={glassesMaterial} position={[-0.38, 0, -0.1]} rotation={[0, -0.4, 0]}>
        <boxGeometry args={[0.35, 0.02, 0.02]} />
      </mesh>
      <mesh material={glassesMaterial} position={[0.38, 0, -0.1]} rotation={[0, 0.4, 0]}>
        <boxGeometry args={[0.35, 0.02, 0.02]} />
      </mesh>
    </group>
  );

  const renderSquareGlasses = () => (
    <group position={[0, 1.55, 0.55]}>
      {/* Left frame */}
      <mesh material={glassesMaterial} position={[-0.2, 0, 0]}>
        <boxGeometry args={[0.28, 0.2, 0.02]} />
      </mesh>
      <mesh material={glassesMaterial} position={[-0.2, 0, 0]}>
        <boxGeometry args={[0.24, 0.16, 0.01]} />
      </mesh>
      <mesh material={lensMaterial} position={[-0.2, 0, 0.01]}>
        <planeGeometry args={[0.22, 0.14]} />
      </mesh>
      {/* Right frame */}
      <mesh material={glassesMaterial} position={[0.2, 0, 0]}>
        <boxGeometry args={[0.28, 0.2, 0.02]} />
      </mesh>
      <mesh material={glassesMaterial} position={[0.2, 0, 0]}>
        <boxGeometry args={[0.24, 0.16, 0.01]} />
      </mesh>
      <mesh material={lensMaterial} position={[0.2, 0, 0.01]}>
        <planeGeometry args={[0.22, 0.14]} />
      </mesh>
      {/* Bridge */}
      <mesh material={glassesMaterial} position={[0, 0, 0.02]}>
        <boxGeometry args={[0.06, 0.03, 0.02]} />
      </mesh>
      {/* Arms */}
      <mesh material={glassesMaterial} position={[-0.4, 0, -0.1]} rotation={[0, -0.35, 0]}>
        <boxGeometry args={[0.4, 0.025, 0.025]} />
      </mesh>
      <mesh material={glassesMaterial} position={[0.4, 0, -0.1]} rotation={[0, 0.35, 0]}>
        <boxGeometry args={[0.4, 0.025, 0.025]} />
      </mesh>
    </group>
  );

  const renderCatEyeGlasses = () => (
    <group position={[0, 1.55, 0.55]}>
      {/* Left frame - cat eye shape */}
      <group position={[-0.2, 0, 0]}>
        <mesh material={glassesMaterial} rotation={[0, 0, 0.2]}>
          <torusGeometry args={[0.13, 0.025, 8, 32]} />
        </mesh>
        {/* Wing */}
        <mesh material={glassesMaterial} position={[-0.1, 0.08, 0]} rotation={[0, 0, 0.5]}>
          <boxGeometry args={[0.08, 0.03, 0.02]} />
        </mesh>
        <mesh material={lensMaterial} position={[0, 0, 0]}>
          <circleGeometry args={[0.11, 32]} />
        </mesh>
      </group>
      {/* Right frame */}
      <group position={[0.2, 0, 0]}>
        <mesh material={glassesMaterial} rotation={[0, 0, -0.2]}>
          <torusGeometry args={[0.13, 0.025, 8, 32]} />
        </mesh>
        <mesh material={glassesMaterial} position={[0.1, 0.08, 0]} rotation={[0, 0, -0.5]}>
          <boxGeometry args={[0.08, 0.03, 0.02]} />
        </mesh>
        <mesh material={lensMaterial} position={[0, 0, 0]}>
          <circleGeometry args={[0.11, 32]} />
        </mesh>
      </group>
      {/* Bridge */}
      <mesh material={glassesMaterial} position={[0, -0.02, 0.02]}>
        <boxGeometry args={[0.06, 0.02, 0.02]} />
      </mesh>
      {/* Arms */}
      <mesh material={glassesMaterial} position={[-0.38, 0.05, -0.1]} rotation={[0, -0.4, 0]}>
        <boxGeometry args={[0.35, 0.02, 0.02]} />
      </mesh>
      <mesh material={glassesMaterial} position={[0.38, 0.05, -0.1]} rotation={[0, 0.4, 0]}>
        <boxGeometry args={[0.35, 0.02, 0.02]} />
      </mesh>
    </group>
  );

  const renderAviatorGlasses = () => (
    <group position={[0, 1.53, 0.55]}>
      {/* Left lens - teardrop shape */}
      <group position={[-0.22, 0, 0]}>
        <mesh material={glassesMaterial}>
          <torusGeometry args={[0.15, 0.015, 8, 32]} />
        </mesh>
        <mesh material={glassesMaterial} position={[0, -0.08, 0]}>
          <sphereGeometry args={[0.08, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        </mesh>
        <mesh material={lensMaterial} position={[0, -0.02, 0]}>
          <circleGeometry args={[0.13, 32]} />
        </mesh>
      </group>
      {/* Right lens */}
      <group position={[0.22, 0, 0]}>
        <mesh material={glassesMaterial}>
          <torusGeometry args={[0.15, 0.015, 8, 32]} />
        </mesh>
        <mesh material={glassesMaterial} position={[0, -0.08, 0]}>
          <sphereGeometry args={[0.08, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        </mesh>
        <mesh material={lensMaterial} position={[0, -0.02, 0]}>
          <circleGeometry args={[0.13, 32]} />
        </mesh>
      </group>
      {/* Double bridge */}
      <mesh material={glassesMaterial} position={[0, 0.03, 0.02]}>
        <boxGeometry args={[0.1, 0.015, 0.015]} />
      </mesh>
      <mesh material={glassesMaterial} position={[0, -0.02, 0.02]}>
        <boxGeometry args={[0.08, 0.015, 0.015]} />
      </mesh>
      {/* Arms */}
      <mesh material={glassesMaterial} position={[-0.42, 0, -0.12]} rotation={[0, -0.35, 0]}>
        <boxGeometry args={[0.4, 0.02, 0.02]} />
      </mesh>
      <mesh material={glassesMaterial} position={[0.42, 0, -0.12]} rotation={[0, 0.35, 0]}>
        <boxGeometry args={[0.4, 0.02, 0.02]} />
      </mesh>
    </group>
  );

  const renderCap = () => (
    <group position={[0, 2.0, 0]}>
      {/* Cap dome */}
      <mesh position={[0, 0, -0.05]}>
        <sphereGeometry args={[0.55, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#2563eb" roughness={0.8} />
      </mesh>
      {/* Cap band */}
      <mesh position={[0, -0.02, 0]}>
        <cylinderGeometry args={[0.56, 0.56, 0.08, 32, 1, true]} />
        <meshStandardMaterial color="#1d4ed8" roughness={0.7} />
      </mesh>
      {/* Cap brim */}
      <mesh position={[0, -0.02, 0.35]} rotation={[-0.2, 0, 0]}>
        <boxGeometry args={[0.5, 0.03, 0.35]} />
        <meshStandardMaterial color="#1e40af" roughness={0.6} />
      </mesh>
      {/* Button on top */}
      <mesh position={[0, 0.52, -0.05]}>
        <sphereGeometry args={[0.05, 12, 12]} />
        <meshStandardMaterial color="#1e40af" roughness={0.5} />
      </mesh>
    </group>
  );

  const renderBeanie = () => (
    <group position={[0, 2.0, 0]}>
      {/* Beanie body */}
      <mesh position={[0, 0.1, -0.05]}>
        <sphereGeometry args={[0.58, 32, 32, 0, Math.PI * 2, 0, 0.6 * Math.PI]} />
        <meshStandardMaterial color="#dc2626" roughness={0.9} />
      </mesh>
      {/* Ribbed band */}
      <mesh position={[0, -0.1, 0]}>
        <cylinderGeometry args={[0.58, 0.56, 0.15, 32]} />
        <meshStandardMaterial color="#b91c1c" roughness={0.95} />
      </mesh>
      {/* Fold detail */}
      <mesh position={[0, -0.05, 0]}>
        <torusGeometry args={[0.57, 0.03, 8, 32]} />
        <meshStandardMaterial color="#991b1b" roughness={0.9} />
      </mesh>
      {/* Pom pom */}
      <mesh position={[0, 0.6, -0.05]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color="#fef3c7" roughness={1} />
      </mesh>
    </group>
  );

  const renderCowboyHat = () => (
    <group position={[0, 2.1, 0]}>
      {/* Crown */}
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.35, 0.45, 0.35, 32]} />
        <meshStandardMaterial color="#92400e" roughness={0.8} />
      </mesh>
      {/* Crown dent */}
      <mesh position={[0, 0.3, 0]}>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshStandardMaterial color="#78350f" roughness={0.8} />
      </mesh>
      {/* Brim */}
      <mesh position={[0, 0, 0]} rotation={[0, 0, 0]}>
        <cylinderGeometry args={[0.75, 0.7, 0.05, 32]} />
        <meshStandardMaterial color="#92400e" roughness={0.7} />
      </mesh>
      {/* Brim curve */}
      <mesh position={[0, 0.02, 0.5]} rotation={[0.3, 0, 0]}>
        <boxGeometry args={[0.3, 0.02, 0.15]} />
        <meshStandardMaterial color="#92400e" roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.02, -0.5]} rotation={[-0.3, 0, 0]}>
        <boxGeometry args={[0.3, 0.02, 0.15]} />
        <meshStandardMaterial color="#92400e" roughness={0.7} />
      </mesh>
      {/* Hat band */}
      <mesh position={[0, 0.05, 0]}>
        <cylinderGeometry args={[0.46, 0.46, 0.06, 32]} />
        <meshStandardMaterial color="#1f2937" roughness={0.6} />
      </mesh>
    </group>
  );

  const renderEarrings = () => (
    <group position={[0, 1.5, 0]}>
      {/* Left earring */}
      <group position={[-0.65, -0.05, 0]}>
        <mesh material={goldMaterial}>
          <torusGeometry args={[0.06, 0.015, 8, 16]} />
        </mesh>
      </group>
      {/* Right earring */}
      <group position={[0.65, -0.05, 0]}>
        <mesh material={goldMaterial}>
          <torusGeometry args={[0.06, 0.015, 8, 16]} />
        </mesh>
      </group>
    </group>
  );

  return (
    <group>
      {/* Glasses */}
      {config.hasGlasses && (
        <>
          {config.glassesStyle === "round" && renderRoundGlasses()}
          {config.glassesStyle === "square" && renderSquareGlasses()}
          {config.glassesStyle === "cat-eye" && renderCatEyeGlasses()}
          {config.glassesStyle === "aviator" && renderAviatorGlasses()}
        </>
      )}

      {/* Hats */}
      {config.hasHat && (
        <>
          {config.hatStyle === "cap" && renderCap()}
          {config.hatStyle === "beanie" && renderBeanie()}
          {config.hatStyle === "cowboy" && renderCowboyHat()}
        </>
      )}

      {/* Earrings */}
      {config.hasEarrings && renderEarrings()}
    </group>
  );
});

Accessories.displayName = "Accessories";

export default Accessories;
