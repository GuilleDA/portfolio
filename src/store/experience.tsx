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
    setPlayback((current) =>
      current === "idle" && insertedId !== null ? "zooming" : current
    );
  }, [insertedId]);

  const onZoomComplete = useCallback(() => {
    setPlayback((current) => {
      if (current !== "zooming") return current;
      const target = projects.find((p) => p.id === insertedId);
      return target ? "playing" : "idle";
    });
  }, [insertedId]);

  const closePlayer = useCallback(() => {
    setPlayback((current) => (current === "playing" ? "idle" : current));
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
