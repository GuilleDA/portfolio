"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useExperience } from "@/store/experience";

/** Capa de UI 2D superpuesta sobre la escena 3D. */
export function Overlay() {
  const { insertedProject, playback, closePlayer } = useExperience();

  return (
    <div className="pointer-events-none fixed inset-0 z-10 p-6 md:p-10">
      {/* Barra del reproductor: título + botón para volver a la escena 3D. */}
      <AnimatePresence>
        {playback === "playing" && insertedProject && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className="pointer-events-none fixed inset-x-0 top-0 z-50 flex items-center justify-between gap-4 p-4 md:p-6"
          >
            <p className="font-mono text-sm text-white/80">
              ▶ {insertedProject.title.toUpperCase()}
            </p>
            <button
              type="button"
              onClick={closePlayer}
              className="pointer-events-auto rounded-full border border-white/20 bg-black/60 px-4 py-2 font-mono text-sm text-white backdrop-blur transition hover:border-white/50 hover:bg-black/80"
            >
              ⏏ Volver
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
