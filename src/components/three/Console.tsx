"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import type { Group } from "three";
import { GLBModel } from "./GLBModel";
import {
  CONSOLE_POSITION,
  CONSOLE_RECENTER,
  CONSOLE_ROTATION,
  CONSOLE_SCALE,
} from "./layout";
import { CONSOLE_GAME_ID, consoleProject } from "@/data/projects";
import { useExperience } from "@/store/experience";

GLBModel.preload("/models/console.glb");

/**
 * Consola retro en el piso. Al clickearla se carga su juego (Arcade Game) en la
 * TV, sin pasar por un cassette. El EJECT vive en el VCR de la TV.
 */
export function Console() {
  const group = useRef<Group>(null);
  const [hovered, setHovered] = useState(false);
  const { insertTape, insertedId, playback } = useExperience();
  const enabled = playback === "idle";
  const isLoaded = insertedId === CONSOLE_GAME_ID;

  useFrame(() => {
    if (!group.current) return;
    const target = hovered && enabled ? 1.05 : 1;
    group.current.scale.lerp({ x: target, y: target, z: target } as never, 0.15);
  });

  return (
    <group
      ref={group}
      position={CONSOLE_POSITION}
      rotation={CONSOLE_ROTATION}
      onClick={(e) => {
        e.stopPropagation();
        if (enabled) insertTape(CONSOLE_GAME_ID);
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
      <GLBModel
        url="/models/console.glb"
        scale={CONSOLE_SCALE}
        position={CONSOLE_RECENTER}
      />

    </group>
  );
}
