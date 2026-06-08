"use client";

import dynamic from "next/dynamic";
import { ExperienceProvider } from "@/store/experience";
import { Overlay } from "@/components/ui/Overlay";

// El Canvas de R3F necesita el DOM/WebGL: lo cargamos solo en cliente.
const SceneCanvas = dynamic(
  () => import("@/components/three/SceneCanvas").then((m) => m.SceneCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="grid h-full w-full place-items-center bg-[#0a0a12]">
        <p className="animate-pulse font-mono text-sm text-white/60">
          Encendiendo la TV…
        </p>
      </div>
    ),
  }
);

export default function Home() {
  return (
    <ExperienceProvider>
      <main className="relative h-dvh w-full overflow-hidden bg-[#0a0a12]">
        <SceneCanvas />
        <Overlay />
      </main>
    </ExperienceProvider>
  );
}
