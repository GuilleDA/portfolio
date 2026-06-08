"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Loader } from "@react-three/drei";
import { Experience } from "./Experience";
import { CAMERA_DEFAULT } from "./layout";

/** Wrapper del Canvas de R3F. Es lo único que importamos en la página. */
export function SceneCanvas() {
  return (
    <>
      <Canvas
        shadows="percentage"
        dpr={[1, 2]}
        gl={{ antialias: true }}
        camera={{ position: CAMERA_DEFAULT.position, fov: 45, near: 0.1, far: 100 }}
      >
        <Suspense fallback={null}>
          <Experience />
        </Suspense>
      </Canvas>
      {/* Barra de carga de assets (útil cuando agregues .glb) */}
      <Loader
        containerStyles={{ background: "#0a0a12" }}
        barStyles={{ background: "#ff4d6d" }}
        dataStyles={{ color: "#ffffff", fontFamily: "monospace" }}
      />
    </>
  );
}
