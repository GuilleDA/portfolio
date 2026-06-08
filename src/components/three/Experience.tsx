"use client";

import { Environment, ContactShadows } from "@react-three/drei";
import { RetroTV } from "./RetroTV";
import { Console } from "./Console";
import { DraggableVHS } from "./DraggableVHS";
import { CameraRig } from "./CameraRig";
import { FLOOR_Y } from "./layout";
import { useExperience } from "@/store/experience";

/** Contenido de la escena 3D (vive dentro del <Canvas>). */
export function Experience() {
  const { insertedProject } = useExperience();
  const accent = insertedProject?.color ?? "#8b8b9a";

  return (
    <>
      <color attach="background" args={["#0a0a12"]} />
      <fog attach="fog" args={["#0a0a12", 9, 18]} />

      {/* Iluminación */}
      <ambientLight intensity={0.35} />
      <spotLight
        position={[4, 7, 6]}
        angle={0.5}
        penumbra={0.8}
        intensity={120}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      {/* Luz de acento del color del proyecto activo, frente a la tele */}
      <pointLight position={[0, 2.2, 3]} intensity={22} color={accent} distance={10} />

      <Environment preset="city" />

      {/* Piso */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, FLOOR_Y, 0]} receiveShadow>
        <planeGeometry args={[60, 60]} />
        <meshStandardMaterial color="#15131c" roughness={0.9} />
      </mesh>
      <ContactShadows
        position={[0, FLOOR_Y + 0.01, 0]}
        opacity={0.5}
        scale={20}
        blur={2.5}
        far={4}
      />

      {/* Objetos: TV+VCR, cassettes flotantes (arrastrar al VCR) y la consola */}
      <RetroTV />
      <DraggableVHS />
      <Console />

      <CameraRig />
    </>
  );
}
