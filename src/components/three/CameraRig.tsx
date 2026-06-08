"use client";

import { useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import gsap from "gsap";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { CAMERA_DEFAULT, CAMERA_ZOOM } from "./layout";
import { useExperience } from "@/store/experience";

/**
 * Controla la cámara: órbita libre en estado "idle" y un zoom animado
 * (GSAP) hacia la pantalla de la TV cuando el usuario reproduce un proyecto.
 */
export function CameraRig() {
  const controls = useRef<OrbitControlsImpl>(null);
  const { camera } = useThree();
  const { playback, onZoomComplete, draggingId } = useExperience();
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

    if (playback === "zooming") {
      hasZoomed.current = true;
      if (ctrl) ctrl.enabled = false;

      tween.current?.kill();
      const tl = gsap.timeline({
        defaults: { duration: 1.5, ease: "power3.inOut" },
        onUpdate: () => ctrl?.update(),
        onComplete: onZoomComplete,
      });

      tl.to(
        camera.position,
        {
          x: CAMERA_ZOOM.position[0],
          y: CAMERA_ZOOM.position[1],
          z: CAMERA_ZOOM.position[2],
        },
        0
      );

      if (ctrl) {
        tl.to(
          ctrl.target,
          {
            x: CAMERA_ZOOM.target[0],
            y: CAMERA_ZOOM.target[1],
            z: CAMERA_ZOOM.target[2],
          },
          0
        );
      }
      tween.current = tl;
    } else if (playback === "idle" && hasZoomed.current) {
      // Volvemos del reproductor: animamos la cámara a su posición inicial.
      hasZoomed.current = false;
      if (ctrl) ctrl.enabled = false;

      tween.current?.kill();
      const tl = gsap.timeline({
        defaults: { duration: 1.2, ease: "power3.inOut" },
        onUpdate: () => ctrl?.update(),
        onComplete: () => {
          if (ctrl) ctrl.enabled = true;
        },
      });

      tl.to(
        camera.position,
        {
          x: CAMERA_DEFAULT.position[0],
          y: CAMERA_DEFAULT.position[1],
          z: CAMERA_DEFAULT.position[2],
        },
        0
      );

      if (ctrl) {
        tl.to(
          ctrl.target,
          {
            x: CAMERA_DEFAULT.target[0],
            y: CAMERA_DEFAULT.target[1],
            z: CAMERA_DEFAULT.target[2],
          },
          0
        );
      }
      tween.current = tl;
    }

    return () => {
      tween.current?.kill();
    };
  }, [playback, camera, onZoomComplete]);

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
