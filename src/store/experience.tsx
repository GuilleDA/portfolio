"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { projects, type Project } from "@/data/projects";

/** Estado del "reproductor": qué hace la cámara ahora mismo. */
export type PlaybackState = "idle" | "zooming" | "playing";

/** Vista del proyecto en reproducción: escritorio (TV) o mobile (celular). */
export type ViewMode = "desktop" | "mobile";

type ExperienceContextValue = {
  /** Proyecto cuyo VHS está insertado en la TV, o null si no hay ninguno. */
  insertedProject: Project | null;
  insertedId: string | null;
  /** Inserta un VHS específico (drag-drop, consola o lista del overlay). */
  insertTape: (id: string) => void;
  /** Expulsa el VHS actual (botón rojo de EJECT). */
  ejectTape: () => void;
  /** Estado de la animación de cámara. */
  playback: PlaybackState;
  /** Dispara el zoom a la TV; al terminar se reproduce el proyecto en pantalla. */
  play: () => void;
  /** La cámara terminó de hacer zoom: pasamos a reproducir (iframe en pantalla). */
  onZoomComplete: () => void;
  /** Cierra el reproductor (iframe) y vuelve al estado inicial. */
  closePlayer: () => void;
  /** Vista actual del proyecto en reproducción (escritorio o mobile). */
  viewMode: ViewMode;
  /** Alterna entre la vista de escritorio (TV) y la vista mobile (celular). */
  toggleViewMode: () => void;
  /** id del VHS bajo el cursor (resaltar), o null. */
  hoveredId: string | null;
  setHoveredId: (id: string | null) => void;
  /** id del VHS que se está arrastrando, o null. */
  draggingId: string | null;
  setDraggingId: (id: string | null) => void;
};

const ExperienceContext = createContext<ExperienceContextValue | null>(null);

export function ExperienceProvider({ children }: { children: ReactNode }) {
  const [insertedId, setInsertedId] = useState<string | null>(null);
  const [playback, setPlayback] = useState<PlaybackState>("idle");
  const [viewMode, setViewMode] = useState<ViewMode>("desktop");
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);

  const insertedProject = projects.find((p) => p.id === insertedId) ?? null;

  const insertTape = useCallback((id: string) => {
    setPlayback((current) => {
      if (current !== "idle") return current;
      if (projects.some((p) => p.id === id)) setInsertedId(id);
      return current;
    });
  }, []);

  const ejectTape = useCallback(() => {
    setPlayback((current) => {
      if (current !== "idle") return current;
      setInsertedId(null);
      return current;
    });
  }, []);

  const play = useCallback(() => {
    setPlayback((current) => {
      if (current === "idle" && insertedId !== null) {
        setViewMode("desktop");
        return "zooming";
      }
      return current;
    });
  }, [insertedId]);

  const onZoomComplete = useCallback(() => {
    setPlayback((current) => {
      if (current !== "zooming") return current;
      const target = projects.find((p) => p.id === insertedId);
      return target ? "playing" : "idle";
    });
  }, [insertedId]);

  const closePlayer = useCallback(() => {
    setPlayback((current) => {
      if (current === "playing") {
        setViewMode("desktop");
        return "idle";
      }
      return current;
    });
  }, []);

  const toggleViewMode = useCallback(() => {
    // Nota: el botón solo se muestra durante "playing", así que basta con
    // alternar la vista. (No anidar setState dentro de otro updater: en
    // StrictMode los updaters corren 2 veces y el toggle se cancelaría.)
    setViewMode((mode) => (mode === "desktop" ? "mobile" : "desktop"));
  }, []);

  const value = useMemo<ExperienceContextValue>(
    () => ({
      insertedProject,
      insertedId,
      insertTape,
      ejectTape,
      playback,
      play,
      onZoomComplete,
      closePlayer,
      viewMode,
      toggleViewMode,
      hoveredId,
      setHoveredId,
      draggingId,
      setDraggingId,
    }),
    [
      insertedProject,
      insertedId,
      insertTape,
      ejectTape,
      playback,
      play,
      onZoomComplete,
      closePlayer,
      viewMode,
      toggleViewMode,
      hoveredId,
      draggingId,
    ]
  );

  return (
    <ExperienceContext.Provider value={value}>
      {children}
    </ExperienceContext.Provider>
  );
}

export function useExperience() {
  const ctx = useContext(ExperienceContext);
  if (!ctx) {
    throw new Error("useExperience debe usarse dentro de <ExperienceProvider>");
  }
  return ctx;
}
