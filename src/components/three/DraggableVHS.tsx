"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import { Group, Plane, Vector3, MathUtils } from "three";
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

function DraggableTape({ project, index }: { project: Project; index: number }) {
  const ref = useRef<Group>(null);
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
      {/* Modelo del cassette (recentrado en el origen del grupo) */}
      <GLBModel url="/models/tape.glb" scale={TAPE_SCALE} position={TAPE_RECENTER} />

      {/* Etiqueta de color del proyecto + título, sobre la cara superior */}
      <mesh position={[0, H / 2 + 0.33, 0.37]} rotation={[0, 0, 0]}>
        <planeGeometry args={[W * 0.45, D * 0.5]} />
        <meshStandardMaterial
          color={project.color}
          emissive={project.color}
          emissiveIntensity={highlight ? 0.55 : 0.2}
          roughness={0.5}
        />
      </mesh>
      <Text
        position={[0, H / 2 + 0.33, 0.38]}
        rotation={[0, 0, 0]}
        fontSize={0.085}
        maxWidth={W * 0.74}
        textAlign="center"
        color="#0b0b0b"
        anchorX="center"
        anchorY="middle"
      >
        {`${project.title}`}
      </Text>

      {/* Halo al pasar el cursor / arrastrar */}
      {highlight && (
        <mesh position={[0, -H / 2 + 0.48, 0]} rotation={[0, 0, 0]}>
          <planeGeometry args={[W * 1.3, D * 1.3]} />
          <meshBasicMaterial color={project.color} transparent opacity={0.2} />
        </mesh>
      )}
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
