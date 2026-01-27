import { memo } from "react";
import * as THREE from "three";
import { AvatarConfig } from "../AvatarModel";

interface HairStylesProps {
  config: AvatarConfig;
  hairMaterial: THREE.MeshStandardMaterial;
  hasHat?: boolean;
}

const HairStyles = memo(({ config, hairMaterial, hasHat = false }: HairStylesProps) => {
  if (config.hairStyle === "bald") return null;

  // If wearing hat, only show hair below the hat
  const showTopHair = !hasHat;

  const renderShortHair = () => (
    <group position={[0, 1.5, 0]}>
      {showTopHair && (
        <>
          {/* Top hair - textured */}
          <mesh material={hairMaterial} position={[0, 0.45, -0.05]}>
            <sphereGeometry args={[0.55, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
          </mesh>
          {/* Hair texture bumps */}
          {[...Array(8)].map((_, i) => (
            <mesh
              key={i}
              material={hairMaterial}
              position={[
                Math.cos(i * Math.PI / 4) * 0.35,
                0.5 + Math.random() * 0.1,
                Math.sin(i * Math.PI / 4) * 0.35 - 0.1,
              ]}
            >
              <sphereGeometry args={[0.12 + Math.random() * 0.05, 8, 8]} />
            </mesh>
          ))}
        </>
      )}
      {/* Sideburns */}
      <mesh material={hairMaterial} position={[-0.55, 0, -0.1]}>
        <capsuleGeometry args={[0.08, 0.15, 4, 8]} />
      </mesh>
      <mesh material={hairMaterial} position={[0.55, 0, -0.1]}>
        <capsuleGeometry args={[0.08, 0.15, 4, 8]} />
      </mesh>
    </group>
  );

  const renderMediumHair = () => (
    <group position={[0, 1.5, 0]}>
      {showTopHair && (
        <>
          {/* Base hair */}
          <mesh material={hairMaterial} position={[0, 0.4, -0.1]}>
            <sphereGeometry args={[0.6, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
          </mesh>
          {/* Volume on top */}
          <mesh material={hairMaterial} position={[0, 0.55, 0]}>
            <sphereGeometry args={[0.4, 16, 16]} />
          </mesh>
        </>
      )}
      {/* Side hair */}
      <mesh material={hairMaterial} position={[-0.5, -0.05, -0.1]}>
        <capsuleGeometry args={[0.18, 0.25, 8, 16]} />
      </mesh>
      <mesh material={hairMaterial} position={[0.5, -0.05, -0.1]}>
        <capsuleGeometry args={[0.18, 0.25, 8, 16]} />
      </mesh>
      {/* Back hair */}
      <mesh material={hairMaterial} position={[0, 0, -0.45]}>
        <capsuleGeometry args={[0.35, 0.3, 8, 16]} />
      </mesh>
    </group>
  );

  const renderLongHair = () => (
    <group position={[0, 1.5, 0]}>
      {showTopHair && (
        <>
          {/* Top hair */}
          <mesh material={hairMaterial} position={[0, 0.4, -0.1]}>
            <sphereGeometry args={[0.6, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
          </mesh>
        </>
      )}
      {/* Long flowing sides */}
      <mesh material={hairMaterial} position={[-0.55, -0.4, -0.1]}>
        <capsuleGeometry args={[0.2, 0.8, 8, 16]} />
      </mesh>
      <mesh material={hairMaterial} position={[0.55, -0.4, -0.1]}>
        <capsuleGeometry args={[0.2, 0.8, 8, 16]} />
      </mesh>
      {/* Back hair - long */}
      <mesh material={hairMaterial} position={[0, -0.3, -0.5]}>
        <capsuleGeometry args={[0.4, 0.8, 8, 16]} />
      </mesh>
      {/* Hair strands */}
      <mesh material={hairMaterial} position={[-0.3, -0.6, -0.35]}>
        <capsuleGeometry args={[0.12, 0.5, 4, 8]} />
      </mesh>
      <mesh material={hairMaterial} position={[0.3, -0.6, -0.35]}>
        <capsuleGeometry args={[0.12, 0.5, 4, 8]} />
      </mesh>
    </group>
  );

  const renderCurlyHair = () => (
    <group position={[0, 1.5, 0]}>
      {showTopHair && (
        <>
          {/* Curly puffs on top */}
          {[...Array(12)].map((_, i) => {
            const angle = (i / 12) * Math.PI * 2;
            const radius = 0.35 + (i % 3) * 0.1;
            return (
              <mesh
                key={i}
                material={hairMaterial}
                position={[
                  Math.cos(angle) * radius,
                  0.45 + Math.sin(i * 2) * 0.1,
                  Math.sin(angle) * radius - 0.1,
                ]}
              >
                <sphereGeometry args={[0.15 + (i % 2) * 0.05, 12, 12]} />
              </mesh>
            );
          })}
          {/* Center volume */}
          <mesh material={hairMaterial} position={[0, 0.55, 0]}>
            <sphereGeometry args={[0.35, 16, 16]} />
          </mesh>
        </>
      )}
      {/* Side curls */}
      {[...Array(6)].map((_, i) => (
        <mesh
          key={`side-${i}`}
          material={hairMaterial}
          position={[
            i < 3 ? -0.55 : 0.55,
            0.1 - (i % 3) * 0.2,
            -0.05,
          ]}
        >
          <sphereGeometry args={[0.12, 10, 10]} />
        </mesh>
      ))}
    </group>
  );

  const renderPonytail = () => (
    <group position={[0, 1.5, 0]}>
      {showTopHair && (
        <>
          {/* Base hair pulled back */}
          <mesh material={hairMaterial} position={[0, 0.35, -0.1]}>
            <sphereGeometry args={[0.58, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
          </mesh>
        </>
      )}
      {/* Ponytail base */}
      <mesh material={hairMaterial} position={[0, 0.2, -0.55]}>
        <sphereGeometry args={[0.18, 12, 12]} />
      </mesh>
      {/* Ponytail length */}
      <mesh material={hairMaterial} position={[0, -0.3, -0.6]} rotation={[0.3, 0, 0]}>
        <capsuleGeometry args={[0.12, 0.6, 8, 16]} />
      </mesh>
      {/* Hair tie */}
      <mesh position={[0, 0.05, -0.55]}>
        <torusGeometry args={[0.1, 0.03, 8, 16]} />
        <meshStandardMaterial color="#4a4a4a" />
      </mesh>
      {/* Side smooth hair */}
      <mesh material={hairMaterial} position={[-0.5, 0, -0.2]} scale={[0.8, 1, 0.6]}>
        <sphereGeometry args={[0.2, 12, 12]} />
      </mesh>
      <mesh material={hairMaterial} position={[0.5, 0, -0.2]} scale={[0.8, 1, 0.6]}>
        <sphereGeometry args={[0.2, 12, 12]} />
      </mesh>
    </group>
  );

  const renderMohawk = () => (
    <group position={[0, 1.5, 0]}>
      {showTopHair && (
        <>
          {/* Mohawk spikes */}
          {[...Array(7)].map((_, i) => (
            <mesh
              key={i}
              material={hairMaterial}
              position={[0, 0.5 + i * 0.02, -0.3 + i * 0.08]}
              rotation={[-0.3, 0, 0]}
            >
              <coneGeometry args={[0.08, 0.25 + i * 0.02, 8]} />
            </mesh>
          ))}
          {/* Base ridge */}
          <mesh material={hairMaterial} position={[0, 0.45, -0.1]}>
            <capsuleGeometry args={[0.12, 0.5, 8, 16]} />
          </mesh>
        </>
      )}
      {/* Shaved sides - slight stubble */}
      <mesh position={[-0.55, 0.1, -0.1]} scale={[1, 1.2, 1]}>
        <sphereGeometry args={[0.15, 12, 12]} />
        <meshStandardMaterial color={config.skinColor} roughness={0.9} />
      </mesh>
      <mesh position={[0.55, 0.1, -0.1]} scale={[1, 1.2, 1]}>
        <sphereGeometry args={[0.15, 12, 12]} />
        <meshStandardMaterial color={config.skinColor} roughness={0.9} />
      </mesh>
    </group>
  );

  switch (config.hairStyle) {
    case "short":
      return renderShortHair();
    case "medium":
      return renderMediumHair();
    case "long":
      return renderLongHair();
    case "curly":
      return renderCurlyHair();
    case "ponytail":
      return renderPonytail();
    case "mohawk":
      return renderMohawk();
    default:
      return renderMediumHair();
  }
});

HairStyles.displayName = "HairStyles";

export default HairStyles;
