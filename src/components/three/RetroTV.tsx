"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import type { MeshStandardMaterial } from "three";
import { CRTScreen } from "./CRTScreen";
import { GLBModel } from "./GLBModel";
import {
  DEBUG_MARKERS,
  TV_GROUP_POSITION,
  TV_MODEL_ROTATION,
  TV_SCALE,
  TV_SCREEN_OFFSET,
  TV_SCREEN_SIZE,
  VCR_BUTTON_RADIUS,
  VCR_CONTROLS_OFFSET,
  VCR_EJECT_OFFSET,
  VCR_PLAY_OFFSET,
} from "./layout";
import { useExperience } from "@/store/experience";

GLBModel.preload("/models/tv.glb");

/**
 * Televisor + mueble + reproductor VHS (modelo tv.glb), pantalla CRT y controles
 * del VCR (PLAY para visitar el proyecto, EJECT para expulsar el cassette).
 */
export function RetroTV() {
  const { playback, insertedProject } = useExperience();
  const hasTape = insertedProject !== null;

  const hint =
    playback !== "idle"
      ? "CARGANDO…"
      : hasTape
      ? "▶ PULSÁ PLAY EN EL REPRODUCTOR"
      : "ARRASTRÁ UN VHS AL REPRODUCTOR";

  return (
    <group position={TV_GROUP_POSITION}>
      <GLBModel
        url="/models/tv.glb"
        scale={TV_SCALE}
        rotation={TV_MODEL_ROTATION}
      />

      <group position={TV_SCREEN_OFFSET}>
        <CRTScreen width={TV_SCREEN_SIZE.width} height={TV_SCREEN_SIZE.height} />
        {DEBUG_MARKERS && (
          <mesh>
            <boxGeometry
              args={[TV_SCREEN_SIZE.width, TV_SCREEN_SIZE.height, 0.05]}
            />
            <meshBasicMaterial color="#00ff66" wireframe />
          </mesh>
        )}
      </group>

      {/* <Text
        position={[
          TV_SCREEN_OFFSET[0],
          TV_SCREEN_OFFSET[1] + TV_SCREEN_SIZE.height / 2 + 0.35,
          TV_SCREEN_OFFSET[2],
        ]}
        fontSize={0.16}
        color={hasTape ? "#ffffff" : "#9aa0a6"}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.004}
        outlineColor="#000000"
      >
        {hint}
      </Text> */}

      <VCRControls />
    </group>
  );
}

/** Panel de botones PLAY + EJECT en el frente del reproductor VHS. */
function VCRControls() {
  return (
    <group position={VCR_CONTROLS_OFFSET}>
      <PlayButton />
      <EjectButton />
    </group>
  );
}

type VcrButtonProps = {
  label: string;
  color: string;
  offset: [number, number, number];
  enabled: boolean;
  onPress: () => void;
};

function VcrButton({ label, color, offset, enabled, onPress }: VcrButtonProps) {
  const mat = useRef<MeshStandardMaterial>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (!mat.current) return;
    const t = state.clock.elapsedTime;
    const pulse = enabled ? 1.4 + Math.sin(t * 4) * 0.6 : 0.2;
    mat.current.emissiveIntensity =
      hovered && enabled ? 3.5 : pulse;
  });

  return (
    <group
      position={offset}
      onClick={(e) => {
        e.stopPropagation();
        if (enabled) onPress();
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        if (enabled) {
          setHovered(true);
          document.body.style.cursor = "pointer";
        }
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = "default";
      }}
    >
      <mesh
        rotation={[Math.PI / 2, 0, 0]}
        scale={hovered && enabled ? 1.12 : 1}
        renderOrder={10}
      >
        <cylinderGeometry
          args={[VCR_BUTTON_RADIUS, VCR_BUTTON_RADIUS, 0.07, 24]}
        />
        <meshStandardMaterial
          ref={mat}
          color={color}
          emissive={color}
          emissiveIntensity={0.3}
          toneMapped={false}
        />
      </mesh>
      <Text
        position={[0, -0.2, 0.06]}
        fontSize={0.09}
        color={enabled ? "#ffffff" : "#666666"}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.004}
        outlineColor="#000000"
        renderOrder={11}
      >
        {label}
      </Text>
    </group>
  );
}

function PlayButton() {
  const { insertedProject, play, playback } = useExperience();
  const hasTape = insertedProject !== null;

  return (
    <VcrButton
      label="▶ PLAY"
      color="#22c55e"
      offset={VCR_PLAY_OFFSET}
      enabled={hasTape && playback === "idle"}
      onPress={play}
    />
  );
}

function EjectButton() {
  const { insertedProject, ejectTape, playback } = useExperience();
  const hasTape = insertedProject !== null;

  return (
    <VcrButton
      label="⏏ EJECT"
      color="#ff2d2d"
      offset={VCR_EJECT_OFFSET}
      enabled={hasTape && playback === "idle"}
      onPress={ejectTape}
    />
  );
}
