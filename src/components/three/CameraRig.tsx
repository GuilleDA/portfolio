"use client";

import { useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import gsap from "gsap";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { CAMERA_DEFAULT, CAMERA_MOBILE, CAMERA_ZOOM } from "./layout";
import { useExperience } from "@/store/experience";

/**
 * Controla la cámara: órbita libre en estado "idle" y un zoom animado
 * (GSAP) hacia la pantalla de la TV cuando el usuario reproduce un proyecto.
 */
export function CameraRig() {
  const controls = useRef<OrbitControlsImpl>(null);
  const { camera } = useThree();
  const { playback, viewMode, onZoomComplete, draggingId } = useExperience();
  const tween = useRef<gsap.core.Timeline | null>(null);
  const hasZoomed = useRef(false);

  // Posición inicial de la cámara.
  useEffect(() => {
    camera.position.set(...CAMERA_DEFAULT.position);
    if (controls.current) {
      controls.current.target.set(...CAMERA_DEFAULT.target);
      controls.current.update();
    }
  }, [camera]);

  // Órbita libre solo en idle y sin arrastrar (se bloquea durante el zoom/drag).
  useEffect(() => {
    if (!controls.current) return;
    controls.current.enabled = playback === "idle" && draggingId === null;
  }, [playback, draggingId]);

  useEffect(() => {
    const ctrl = controls.current;

    /** Anima la cámara (y el target de OrbitControls) a un encuadre. */
    const flyTo = (
      frame: { position: typeof CAMERA_DEFAULT.position; target: typeof CAMERA_DEFAULT.target },
      duration: number,
      onComplete?: () => void
    ) => {
      if (ctrl) ctrl.enabled = false;
      tween.current?.kill();
      const tl = gsap.timeline({
        defaults: { duration, ease: "power3.inOut" },
        onUpdate: () => ctrl?.update(),
        onComplete,
      });
      tl.to(
        camera.position,
        { x: frame.position[0], y: frame.position[1], z: frame.position[2] },
        0
      );
      if (ctrl) {
        tl.to(
          ctrl.target,
          { x: frame.target[0], y: frame.target[1], z: frame.target[2] },
          0
        );
      }
      tween.current = tl;
    };

    if (playback === "zooming") {
      hasZoomed.current = true;
      flyTo(CAMERA_ZOOM, 1.5, onZoomComplete);
    } else if (playback === "playing") {
      // En reproducción alternamos entre el encuadre de la TV y el del celular.
      flyTo(viewMode === "mobile" ? CAMERA_MOBILE : CAMERA_ZOOM, 1.1);
    } else if (playback === "idle" && hasZoomed.current) {
      // Volvemos del reproductor: animamos la cámara a su posición inicial.
      hasZoomed.current = false;
      flyTo(CAMERA_DEFAULT, 1.2, () => {
        if (ctrl) ctrl.enabled = true;
      });
    }

    return () => {
      tween.current?.kill();
    };
  }, [playback, viewMode, camera, onZoomComplete]);

  return (
    <OrbitControls
      ref={controls}
      enablePan={false}
      minDistance={3}
      maxDistance={11}
      minPolarAngle={Math.PI / 6}
      maxPolarAngle={Math.PI / 2.05}
      minAzimuthAngle={-Math.PI / 3}
      maxAzimuthAngle={Math.PI / 3}
      enableDamping
      dampingFactor={0.08}
    />
  );
}
