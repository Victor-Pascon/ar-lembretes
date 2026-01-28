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

  // Adjusted position for bigger cartoon head
  const baseY = 1.6;

  const renderShortHair = () => (
    <group position={[0, baseY, 0]}>
      {showTopHair && (
        <>
          {/* Top hair - more volume for cartoon */}
          <mesh material={hairMaterial} position={[0, 0.5, -0.05]}>
            <sphereGeometry args={[0.65, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
          </mesh>
          {/* Hair texture bumps - bigger */}
          {[...Array(10)].map((_, i) => (
            <mesh
              key={i}
              material={hairMaterial}
              position={[
                Math.cos(i * Math.PI / 5) * 0.4,
                0.55 + Math.random() * 0.12,
                Math.sin(i * Math.PI / 5) * 0.4 - 0.1,
              ]}
            >
              <sphereGeometry args={[0.15 + Math.random() * 0.06, 10, 10]} />
            </mesh>
          ))}
        </>
      )}
      {/* Sideburns */}
      <mesh material={hairMaterial} position={[-0.62, 0.05, -0.1]}>
        <capsuleGeometry args={[0.1, 0.18, 6, 10]} />
      </mesh>
      <mesh material={hairMaterial} position={[0.62, 0.05, -0.1]}>
        <capsuleGeometry args={[0.1, 0.18, 6, 10]} />
      </mesh>
    </group>
  );

  const renderMediumHair = () => (
    <group position={[0, baseY, 0]}>
      {showTopHair && (
        <>
          {/* Base hair - bigger */}
          <mesh material={hairMaterial} position={[0, 0.45, -0.1]}>
            <sphereGeometry args={[0.7, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
          </mesh>
          {/* Volume on top */}
          <mesh material={hairMaterial} position={[0, 0.6, 0]}>
            <sphereGeometry args={[0.48, 18, 18]} />
          </mesh>
        </>
      )}
      {/* Side hair - more volume */}
      <mesh material={hairMaterial} position={[-0.58, -0.02, -0.1]}>
        <capsuleGeometry args={[0.22, 0.3, 10, 18]} />
      </mesh>
      <mesh material={hairMaterial} position={[0.58, -0.02, -0.1]}>
        <capsuleGeometry args={[0.22, 0.3, 10, 18]} />
      </mesh>
      {/* Back hair */}
      <mesh material={hairMaterial} position={[0, 0.02, -0.5]}>
        <capsuleGeometry args={[0.4, 0.35, 10, 18]} />
      </mesh>
    </group>
  );

  const renderLongHair = () => (
    <group position={[0, baseY, 0]}>
      {showTopHair && (
        <>
          {/* Top hair */}
          <mesh material={hairMaterial} position={[0, 0.45, -0.1]}>
            <sphereGeometry args={[0.7, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
          </mesh>
        </>
      )}
      {/* Long flowing sides - more volume */}
      <mesh material={hairMaterial} position={[-0.6, -0.35, -0.1]}>
        <capsuleGeometry args={[0.24, 0.9, 10, 18]} />
      </mesh>
      <mesh material={hairMaterial} position={[0.6, -0.35, -0.1]}>
        <capsuleGeometry args={[0.24, 0.9, 10, 18]} />
      </mesh>
      {/* Back hair - long and voluminous */}
      <mesh material={hairMaterial} position={[0, -0.25, -0.55]}>
        <capsuleGeometry args={[0.48, 0.9, 10, 18]} />
      </mesh>
      {/* Hair strands */}
      <mesh material={hairMaterial} position={[-0.35, -0.55, -0.4]}>
        <capsuleGeometry args={[0.14, 0.55, 6, 10]} />
      </mesh>
      <mesh material={hairMaterial} position={[0.35, -0.55, -0.4]}>
        <capsuleGeometry args={[0.14, 0.55, 6, 10]} />
      </mesh>
    </group>
  );

  const renderCurlyHair = () => (
    <group position={[0, baseY, 0]}>
      {showTopHair && (
        <>
          {/* Curly puffs on top - bigger and fluffier */}
          {[...Array(14)].map((_, i) => {
            const angle = (i / 14) * Math.PI * 2;
            const radius = 0.4 + (i % 3) * 0.12;
            return (
              <mesh
                key={i}
                material={hairMaterial}
                position={[
                  Math.cos(angle) * radius,
                  0.5 + Math.sin(i * 2) * 0.12,
                  Math.sin(angle) * radius - 0.1,
                ]}
              >
                <sphereGeometry args={[0.18 + (i % 2) * 0.06, 14, 14]} />
              </mesh>
            );
          })}
          {/* Center volume */}
          <mesh material={hairMaterial} position={[0, 0.6, 0]}>
            <sphereGeometry args={[0.42, 18, 18]} />
          </mesh>
        </>
      )}
      {/* Side curls - bigger */}
      {[...Array(8)].map((_, i) => (
        <mesh
          key={`side-${i}`}
          material={hairMaterial}
          position={[
            i < 4 ? -0.6 : 0.6,
            0.12 - (i % 4) * 0.22,
            -0.05,
          ]}
        >
          <sphereGeometry args={[0.14, 12, 12]} />
        </mesh>
      ))}
    </group>
  );

  const renderPonytail = () => (
    <group position={[0, baseY, 0]}>
      {showTopHair && (
        <>
          {/* Base hair pulled back */}
          <mesh material={hairMaterial} position={[0, 0.4, -0.1]}>
            <sphereGeometry args={[0.68, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
          </mesh>
        </>
      )}
      {/* Ponytail base - rounder */}
      <mesh material={hairMaterial} position={[0, 0.25, -0.6]}>
        <sphereGeometry args={[0.22, 14, 14]} />
      </mesh>
      {/* Ponytail length - thicker */}
      <mesh material={hairMaterial} position={[0, -0.25, -0.65]} rotation={[0.35, 0, 0]}>
        <capsuleGeometry args={[0.15, 0.65, 10, 18]} />
      </mesh>
      {/* Hair tie */}
      <mesh position={[0, 0.08, -0.6]}>
        <torusGeometry args={[0.12, 0.035, 10, 18]} />
        <meshStandardMaterial color="#ff6b9d" />
      </mesh>
      {/* Side smooth hair */}
      <mesh material={hairMaterial} position={[-0.55, 0.02, -0.2]} scale={[0.85, 1, 0.65]}>
        <sphereGeometry args={[0.24, 14, 14]} />
      </mesh>
      <mesh material={hairMaterial} position={[0.55, 0.02, -0.2]} scale={[0.85, 1, 0.65]}>
        <sphereGeometry args={[0.24, 14, 14]} />
      </mesh>
    </group>
  );

  const renderMohawk = () => (
    <group position={[0, baseY, 0]}>
      {showTopHair && (
        <>
          {/* Mohawk spikes - bigger and bolder */}
          {[...Array(8)].map((_, i) => (
            <mesh
              key={i}
              material={hairMaterial}
              position={[0, 0.55 + i * 0.025, -0.32 + i * 0.1]}
              rotation={[-0.35, 0, 0]}
            >
              <coneGeometry args={[0.1, 0.3 + i * 0.025, 10]} />
            </mesh>
          ))}
          {/* Base ridge */}
          <mesh material={hairMaterial} position={[0, 0.5, -0.1]}>
            <capsuleGeometry args={[0.14, 0.55, 10, 18]} />
          </mesh>
        </>
      )}
      {/* Shaved sides - slight stubble */}
      <mesh position={[-0.6, 0.12, -0.1]} scale={[1, 1.25, 1]}>
        <sphereGeometry args={[0.18, 14, 14]} />
        <meshStandardMaterial color={config.skinColor} roughness={0.85} />
      </mesh>
      <mesh position={[0.6, 0.12, -0.1]} scale={[1, 1.25, 1]}>
        <sphereGeometry args={[0.18, 14, 14]} />
        <meshStandardMaterial color={config.skinColor} roughness={0.85} />
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
