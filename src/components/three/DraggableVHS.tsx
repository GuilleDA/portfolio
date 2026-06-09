"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import { Group, BackSide, Plane, Vector3, MathUtils } from "three";
import { tapeProjects, type Project } from "@/data/projects";
import { GLBModel } from "./GLBModel";
import {
  DEBUG_MARKERS,
  TAPE_RECENTER,
  TAPE_SCALE,
  VHS_TAPE,
  VHS_FLOAT,
  getFloatHome,
  VCR_SLOT_WORLD,
} from "./layout";
import { useExperience } from "@/store/experience";

GLBModel.preload("/models/tape.glb");

const { width: W, height: H, depth: D } = VHS_TAPE;
/** Solo 2 cassettes flotando encima de la TV. */
const floatingTapes = tapeProjects.slice(0, 2);
const N = floatingTapes.length;
/** A qué distancia (en pantalla, NDC) del slot se considera "insertado" al soltar. */
const DROP_NDC = 0.17;

/** Área máxima del logo sobre la etiqueta del cassette. */
const LOGO_MAX_W = W * 0.4;
const LOGO_MAX_H = D * 0.3;

function fitPlaneToAspect(
  imgW: number,
  imgH: number,
  maxW: number,
  maxH: number,
): [number, number] {
  if (imgW <= 0 || imgH <= 0) return [maxW, maxH];
  const aspect = imgW / imgH;
  const boxAspect = maxW / maxH;
  if (aspect >= boxAspect) return [maxW, maxW / aspect];
  return [maxH * aspect, maxH];
}

/** Logo del proyecto sobre la etiqueta del cassette. */
function TapeLogo({ logo }: { logo: string }) {
  const logoTexture = useTexture(logo);
  const [planeSize, setPlaneSize] = useState<[number, number]>([
    LOGO_MAX_W,
    LOGO_MAX_H,
  ]);

  useEffect(() => {
    const img = logoTexture.image as HTMLImageElement | undefined;
    if (!img) return;

    const update = () => {
      setPlaneSize(
        fitPlaneToAspect(
          img.naturalWidth || img.width,
          img.naturalHeight || img.height,
          LOGO_MAX_W,
          LOGO_MAX_H,
        ),
      );
    };

    if (img.complete && (img.naturalWidth || img.width)) {
      update();
      return;
    }

    img.addEventListener("load", update);
    return () => img.removeEventListener("load", update);
  }, [logoTexture]);

  const [planeW, planeH] = planeSize;

  return (
    <mesh position={[0, H / 2 + 0.33, 0.36205]} rotation={[0, 0, 0]}>
      <planeGeometry args={[planeW, planeH]} />
      <meshBasicMaterial map={logoTexture} transparent opacity={1} />
    </mesh>
  );
}

function DraggableTape({ project, index }: { project: Project; index: number }) {
  const ref = useRef<Group>(null);
  const modelRef = useRef<Group>(null);
  const { camera } = useThree();
  const {
    insertedId,
    insertTape,
    hoveredId,
    setHoveredId,
    draggingId,
    setDraggingId,
    playback,
  } = useExperience();

  const isInserted = insertedId === project.id;
  const isDragging = draggingId === project.id;
  const isHovered = hoveredId === project.id;
  const highlight = isDragging || isHovered;

  const dragPlane = useMemo(() => new Plane(), []);
  const dragOffset = useMemo(() => new Vector3(), []);
  const hitPoint = useMemo(() => new Vector3(), []);
  const camDir = useMemo(() => new Vector3(), []);
  const ndcA = useMemo(() => new Vector3(), []);
  const ndcB = useMemo(() => new Vector3(), []);

  const home = useMemo(() => getFloatHome(index, N), [index]);
  const phase = index * 1.7;

  useFrame((state) => {
    const g = ref.current;
    if (!g) return;

    // Escala: desaparece (0) cuando está insertado, aparece (1) si no.
    const targetScale = isInserted ? 0 : 1;
    g.scale.setScalar(MathUtils.lerp(g.scale.x, targetScale, 0.18));

    // Pop sutil al hover/drag (desactivado por ahora).
    // const mg = modelRef.current;
    // if (mg) mg.scale.setScalar(MathUtils.lerp(mg.scale.x, highlight ? 1.05 : 1, 0.2));

    if (isDragging) return; // posición controlada por el puntero

    let tx: number, ty: number, tz: number, ry: number;
    if (isInserted) {
      [tx, ty, tz] = VCR_SLOT_WORLD;
      ry = 0;
    } else {
      const t = state.clock.elapsedTime;
      tx = home[0];
      ty = home[1] + Math.sin(t * VHS_FLOAT.bobSpeed + phase) * VHS_FLOAT.bobAmp;
      tz = home[2];
      ry = Math.sin(t * 0.6 + phase) * 0.18;
    }
    g.position.x = MathUtils.lerp(g.position.x, tx, 0.14);
    g.position.y = MathUtils.lerp(g.position.y, ty, 0.14);
    g.position.z = MathUtils.lerp(g.position.z, tz, 0.14);
    g.rotation.y = MathUtils.lerp(g.rotation.y, ry, 0.1);
  });

  const onPointerDown = (e: ThreeEvent<PointerEvent>) => {
    if (playback !== "idle" || isInserted || !ref.current) return;
    e.stopPropagation();
    (e.target as Element).setPointerCapture?.(e.pointerId);
    setDraggingId(project.id);
    camera.getWorldDirection(camDir);
    dragPlane.setFromNormalAndCoplanarPoint(camDir, ref.current.position);
    dragOffset.copy(ref.current.position).sub(e.point);
    document.body.style.cursor = "grabbing";
  };

  const onPointerMove = (e: ThreeEvent<PointerEvent>) => {
    if (!isDragging || !ref.current) return;
    e.stopPropagation();
    if (e.ray.intersectPlane(dragPlane, hitPoint)) {
      ref.current.position.copy(hitPoint).add(dragOffset);
    }
  };

  const onPointerUp = (e: ThreeEvent<PointerEvent>) => {
    if (!isDragging || !ref.current) return;
    e.stopPropagation();
    (e.target as Element).releasePointerCapture?.(e.pointerId);
    setDraggingId(null);
    document.body.style.cursor = "default";

    // Proximidad en pantalla (NDC) a la ranura del VCR.
    ndcA.copy(ref.current.position).project(camera);
    ndcB.set(...VCR_SLOT_WORLD).project(camera);
    const dist = Math.hypot(ndcA.x - ndcB.x, ndcA.y - ndcB.y);
    if (dist <= DROP_NDC) {
      insertTape(project.id); // se inserta → desaparece
    }
  };

  return (
    <group
      ref={ref}
      position={home}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerOver={(e) => {
        e.stopPropagation();
        if (playback === "idle" && !isInserted) {
          setHoveredId(project.id);
          document.body.style.cursor = "grab";
        }
      }}
      onPointerOut={() => {
        if (!isDragging) {
          setHoveredId(null);
          document.body.style.cursor = "default";
        }
      }}
    >
      {/* Modelo + contorno acotado al tamaño del cassette (no recorre el GLB). */}
      <group ref={modelRef}>
        <GLBModel
          url="/models/tape.glb"
          scale={TAPE_SCALE}
          position={TAPE_RECENTER}
        />
        {highlight && (
          <mesh position={[-0.020, 0.43, 0.40]} scale={TAPE_SCALE}>
            <boxGeometry args={[1.1, 0.7, 0.3]} />
            <meshBasicMaterial color={project.color} side={BackSide} />
          </mesh>
        )}
      </group>

      {/* Etiqueta de color del proyecto + título, sobre la cara superior */}
      <mesh position={[0, H / 2 + 0.33, 0.362]} rotation={[0, 0, 0]}>
        <planeGeometry args={[W * 0.45, D * 0.5]} />
        <meshStandardMaterial
          color={project.color}
          emissive={project.color}
          emissiveIntensity={highlight ? 0.75 : 0.2}
          roughness={0.5}
        />
      </mesh>
      {project.logo ? <TapeLogo key={project.logo} logo={project.logo} /> : null}
    </group>
  );
}

/** Indicador que aparece en la ranura del VCR mientras se arrastra un cassette. */
function DropTarget() {
  const ref = useRef<Group>(null);
  const { draggingId } = useExperience();
  useFrame((state) => {
    if (!ref.current) return;
    const want = draggingId !== null ? 1 : 0;
    ref.current.scale.setScalar(MathUtils.lerp(ref.current.scale.x, want, 0.2));
    ref.current.rotation.z = state.clock.elapsedTime * 1.2;
  });
  return (
    <group ref={ref} position={VCR_SLOT_WORLD} scale={0}>
      <mesh>
        <ringGeometry args={[0.5, 0.64, 5]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.65} />
      </mesh>
    </group>
  );
}

/** Cassettes VHS flotantes y arrastrables (todos menos el de la consola). */
export function DraggableVHS() {
  return (
    <group>
      {floatingTapes.map((project, index) => (
        <DraggableTape key={project.id} project={project} index={index} />
      ))}
      <DropTarget />

      {DEBUG_MARKERS && (
        <mesh position={VCR_SLOT_WORLD}>
          <boxGeometry args={[0.4, 0.2, 0.4]} />
          <meshBasicMaterial color="#ff0033" wireframe />
        </mesh>
      )}
    </group>
  );
}
