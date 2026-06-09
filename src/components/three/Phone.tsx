"use client";

import { useEffect, useRef, useState } from "react";
import { Group } from "three";
import { Html } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { GLBModel } from "./GLBModel";
import {
  DEBUG_MARKERS,
  PHONE_ENTRY_DELAY,
  PHONE_ENTRY_DROP,
  PHONE_HELD,
  PHONE_ROTATION,
  PHONE_SCALE,
  PHONE_SCREEN_OFFSET,
  PHONE_SCREEN_SIZE,
} from "./layout";
import { useExperience } from "@/store/experience";
import { enableTouchEmulation } from "@/lib/touchEmulation";

GLBModel.preload("/models/PHONE.glb");

/** smoothstep: easing suave para entrada y salida. */
const smoothstep = (t: number) => t * t * (3 - 2 * t);

/**
 * Celular de la "vista mobile". Va anclado a la cámara (efecto "lo tenés en la
 * mano") y maneja por dentro su animación según viewMode:
 *   - mobile  → espera a que la cámara mire hacia abajo y SUBE desde fuera de cuadro.
 *   - desktop → BAJA y se va de pantalla, y recién ahí se desmonta el iframe.
 */
export function Phone() {
  const { insertedProject, viewMode } = useExperience();
  const { camera } = useThree();
  const ref = useRef<Group>(null);

  const active = viewMode === "mobile";

  // `progress` 0 = fuera de cuadro (abajo); 1 = en la mano. Lo animamos a mano.
  const progress = useRef(0);
  const elapsed = useRef(0);

  // Renderizamos el modelo + iframe solo mientras se ve o se está animando, así
  // el iframe se descarga cuando el celular queda oculto (en desktop).
  const [render, setRender] = useState(active);
  if (active && !render) setRender(true);

  // Refs sincronizadas para leer el estado actual dentro del loop de useFrame.
  const activeRef = useRef(active);
  const renderRef = useRef(render);
  useEffect(() => {
    activeRef.current = active;
  }, [active]);
  useEffect(() => {
    renderRef.current = render;
  }, [render]);

  useFrame((_, delta) => {
    const isActive = activeRef.current;
    if (isActive) {
      // Esperar a que la cámara baje antes de subir el celular.
      elapsed.current += delta;
      if (elapsed.current >= PHONE_ENTRY_DELAY) {
        progress.current = Math.min(1, progress.current + delta * 2.6);
      }
    } else {
      elapsed.current = 0;
      progress.current = Math.max(0, progress.current - delta * 3.0);
      // Cuando terminó de bajar, desmontamos el iframe.
      if (progress.current <= 0.0001 && renderRef.current) setRender(false);
    }

    const g = ref.current;
    if (!g) return;
    const eased = smoothstep(progress.current);
    // Desplazamiento hacia abajo cuando está fuera de cuadro (progress 0).
    const dropY = (1 - eased) * -PHONE_ENTRY_DROP;

    // Alinear el grupo con la cámara y trasladarlo en su espacio local.
    g.position.copy(camera.position);
    g.quaternion.copy(camera.quaternion);
    g.translateX(PHONE_HELD.position[0]);
    g.translateY(PHONE_HELD.position[1] + dropY);
    g.translateZ(PHONE_HELD.position[2]);
    g.rotateX(PHONE_HELD.rotation[0]);
    g.rotateY(PHONE_HELD.rotation[1]);
    g.rotateZ(PHONE_HELD.rotation[2]);
  });

  if (!insertedProject || !render) return null;

  const { width, height } = PHONE_SCREEN_SIZE;
  // Ancho mobile real para forzar el layout responsive del proyecto.
  const FRAME_W = 430;
  const FRAME_H = Math.round((FRAME_W * height) / width);
  const distanceFactor = (width * 400) / FRAME_W;

  return (
    <group ref={ref}>
      <GLBModel
        url="/models/PHONE.glb"
        scale={PHONE_SCALE}
        rotation={PHONE_ROTATION}
      />

      <group position={PHONE_SCREEN_OFFSET}>
        {DEBUG_MARKERS && (
          <mesh>
            <planeGeometry args={[width, height]} />
            <meshBasicMaterial color="#00ff66" wireframe />
          </mesh>
        )}

        <Html
          transform
          position={[0, 0, 0.01]}
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
              title={`${insertedProject.title} (mobile)`}
              onLoad={(e) => enableTouchEmulation(e.currentTarget)}
              style={{
                width: "100%",
                height: "100%",
                border: "0",
                display: "block",
              }}
            />
          </div>
        </Html>
      </group>
    </group>
  );
}
