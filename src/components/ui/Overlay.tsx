"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useExperience } from "@/store/experience";

/** Capa de UI 2D superpuesta sobre la escena 3D. */
export function Overlay() {
  const { insertedProject, playback, closePlayer, viewMode, toggleViewMode } =
    useExperience();

  const handleGoToWebsite = () => {
    window.open(insertedProject?.url || "", "_blank");
  };

  return (
    <div className="pointer-events-none fixed inset-0 z-[200] p-6 md:p-10">
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
            <div className="flex items-center gap-2">
            <button
                type="button"
                onClick={handleGoToWebsite}
                className="pointer-events-auto rounded-full border border-white/20 bg-black/60 px-4 py-2 font-mono text-sm text-white backdrop-blur transition hover:border-white/50 hover:bg-black/80"
              >
                {"Open website in new tab"} 
              </button>
              <button
                type="button"
                onClick={toggleViewMode}
                className="pointer-events-auto rounded-full border border-white/20 bg-black/60 px-4 py-2 font-mono text-sm text-white backdrop-blur transition hover:border-white/50 hover:bg-black/80"
              >
                {viewMode === "desktop"
                  ? "View mobile version"
                  : "View desktop version"}
              </button>
              <button
                type="button"
                onClick={closePlayer}
                className="pointer-events-auto rounded-full border border-white/20 bg-black/60 px-4 py-2 font-mono text-sm text-white backdrop-blur transition hover:border-white/50 hover:bg-black/80"
              >
                Back
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
