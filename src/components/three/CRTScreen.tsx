"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, Html } from "@react-three/drei";
import type { Mesh, MeshStandardMaterial } from "three";
import { useExperience } from "@/store/experience";

type CRTScreenProps = {
  width: number;
  height: number;
  /** Muestra texto más compacto (para pantallas pequeñas). */
  compact?: boolean;
};

/**
 * Pantalla CRT reutilizable. Muestra el proyecto del VHS insertado con un brillo
 * del color del proyecto + un parpadeo sutil. Si no hay VHS, muestra "SIN SEÑAL".
 */
export function CRTScreen({ width, height, compact = false }: CRTScreenProps) {
  const matRef = useRef<MeshStandardMaterial>(null);
  const glowRef = useRef<Mesh>(null);
  const { insertedProject, playback } = useExperience();
  const hasTape = insertedProject !== null;
  const tint = insertedProject?.color ?? "#6b7280";
  const isPlaying = playback === "playing" && hasTape;

  // Mapea un iframe (en px) a las medidas reales de la pantalla en el mundo 3D.
  // worldWidth = pixelWidth * distanceFactor / 400  (modo `transform` de drei).
  const FRAME_W = 1280;
  const FRAME_H = Math.round((FRAME_W * height) / width);
  const distanceFactor = (width * 400) / FRAME_W;

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (!matRef.current) return;
    if (hasTape) {
      // Parpadeo sutil del brillo de la pantalla.
      matRef.current.emissiveIntensity =
        0.55 + Math.sin(t * 8) * 0.04 + Math.sin(t * 23) * 0.02;
    } else {
      // Estática: parpadeo más nervioso y tenue.
      matRef.current.emissiveIntensity =
        0.22 + Math.abs(Math.sin(t * 30)) * 0.12 + Math.sin(t * 90) * 0.05;
    }
  });

  const titleSize = compact ? height * 0.16 : height * 0.18;

  return (
    <group>
      {/* Superficie de la pantalla */}
      <mesh ref={glowRef} renderOrder={1}>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial
          ref={matRef}
          color="#0b0f1a"
          emissive={tint}
          emissiveIntensity={0.55}
          toneMapped={false}
          polygonOffset
          polygonOffsetFactor={-1}
          polygonOffsetUnits={-1}
        />
      </mesh>

      {!hasTape && (
        <>
          <Text
            position={[0, height * 0.05, 0.02]}
            fontSize={height * 0.16}
            color="#e5e7eb"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.006}
            outlineColor="#000000"
          >
            SIN SEÑAL
          </Text>
          <Text
            position={[0, -height * 0.18 , 0.02]}
            fontSize={height * 0.085}
            maxWidth={width * 0.85}
            textAlign="center"
            color="#9aa0a6"
            anchorX="center"
            anchorY="middle"
          >
            insertá un VHS para reproducir
          </Text>
        </>
      )}

      {hasTape && !isPlaying && (
        <>
          {/* Título del proyecto */}
          <Text
            position={[0, compact ? 0 : 0.05, 0.02]}
            fontSize={titleSize}
            maxWidth={width * 0.85}
            textAlign="center"
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.006}
            outlineColor={tint}
          >
            {insertedProject.title}
          </Text>
        </>
      )}

      {/* Reproducción: el proyecto cargado dentro de un iframe sobre el CRT. */}
      {isPlaying && (
        <Html
          transform
          position={[0, 0, 0.04]}
          distanceFactor={distanceFactor}
          pointerEvents="auto"
          zIndexRange={[100, 0]}
        >
          <div
            style={{
              width: `${FRAME_W}px`,
              height: `${FRAME_H}px`,
              background: "#000000",
              overflow: "hidden",
            }}
          >
            <iframe
              src={insertedProject.url}
              title={insertedProject.title}
              style={{
                width: "100%",
                height: "100%",
                border: "0",
                display: "block",
              }}
            />
          </div>
        </Html>
      )}
    </group>
  );
}
