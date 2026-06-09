"use client";

import { Environment, ContactShadows } from "@react-three/drei";
import { EffectComposer, DepthOfField } from "@react-three/postprocessing";
import { RetroTV } from "./RetroTV";
import { Console } from "./Console";
import { DraggableVHS } from "./DraggableVHS";
import { CameraRig } from "./CameraRig";
import { Phone } from "./Phone";
import { Room } from "./Room";
import { FLOOR_Y } from "./layout";
import { useExperience } from "@/store/experience";

/** Contenido de la escena 3D (vive dentro del <Canvas>). */
export function Experience() {
  const { insertedProject, playback } = useExperience();
  const accent = insertedProject?.color ?? "#8b8b9a";
  // El Phone queda montado durante toda la reproducción y maneja por dentro su
  // animación de entrada/salida según viewMode (así puede animar al volver a desktop).
  const showPhone = playback === "playing";

  return (
    <>
      <color attach="background" args={["#0d0b0e"]} />
      <fog attach="fog" args={["#0d0b0e", 16, 42]} />

      {/* Iluminación cálida tipo cuarto: relleno hemisférico + ambiente tibio */}
      <hemisphereLight args={["#fff1da", "#241c14", 0.55]} />
      <ambientLight intensity={0.3} color="#ffe9cf" />
      <spotLight
        position={[4, 7, 6]}
        angle={0.5}
        penumbra={0.8}
        intensity={110}
        color="#fff2dd"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      {/* Glow cálido sobre la pared de posters (como las lucecitas de la foto) */}
      <pointLight position={[0, 6, -5]} intensity={45} color="#ffcf8f" distance={30} />
      {/* Luz de acento del color del proyecto activo, frente a la tele */}
      <pointLight position={[0, 3, 3]} intensity={16} color={accent} distance={11} />

      <Environment preset="city" />

      {/* Habitación: piso PBR + paredes */}
      <Room />
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
      {showPhone && <Phone />}

      <CameraRig />

      {/* Profundidad de campo: enfoca la TV y desenfoca lo de atrás (paredes).
          Solo en la vista de exploración (idle); en reproducción/mobile se apaga
          para no desenfocar la pantalla ni el celular en mano. */}
      {(
        <EffectComposer autoClear={false}>
          <DepthOfField
            worldFocusDistance={8}
            worldFocusRange={24}
            bokehScale={12}
            height={480}
          />
        </EffectComposer>
      )}
    </>
  );
}
