"use client";

import { useEffect, useRef, useState } from "react";
import {
  MeshStandardMaterial,
  NoColorSpace,
  RepeatWrapping,
  SRGBColorSpace,
  TextureLoader,
  type Texture,
} from "three";
import { useTexture } from "@react-three/drei";
import { FLOOR_Y } from "./layout";

/**
 * Carga una textura nítida. El desenfoque del fondo lo hace el Depth of Field
 * de la escena, así que acá solo cargamos la imagen tal cual. Devuelve null si
 * falla (la pared queda con su color de respaldo, sin romper la escena).
 */
function loadTexture(url: string): Promise<Texture | null> {
  return new Promise((resolve) => {
    new TextureLoader().load(
      url,
      (tex) => {
        tex.colorSpace = SRGBColorSpace;
        tex.anisotropy = 8;
        tex.needsUpdate = true;
        resolve(tex);
      },
      undefined,
      () => resolve(null),
    );
  });
}

// Cuántas veces se repite la textura del piso (más bajo = tablones más grandes).
const FLOOR_REPEAT = 10;

// ---- Dimensiones del cuarto ----
const WALL_H = 18;
const BACK_Z = -13; // pared del fondo (más lejos = posters más chicos, más cuarto)
const WALL_ASPECT = 2.34; // proporción de la foto, para no estirarla
const ROOM_W = WALL_H * WALL_ASPECT; // ancho de la foto del fondo
const SIDE_X = ROOM_W / 2; // los laterales se ubican en las esquinas del fondo
// Laterales con proporción 16:9 (como left.png/right.png) para no estirarlas.
const SIDE_ASPECT = 16 / 9;
// Solapamos las esquinas para que no se vea una línea/junta blanca:
//  - el fondo se hace un poco más ancho y tapa el canto de los laterales,
//  - los laterales se meten un poco por detrás del fondo.
const CORNER_OVERLAP = 0.5;
const BACK_W = ROOM_W + CORNER_OVERLAP * 2;
const SIDE_BACK_Z = BACK_Z - 0.3;
const FRONT_Z = BACK_Z + WALL_H * SIDE_ASPECT; // pasan por detrás de la cámara
const SIDE_DEPTH = FRONT_Z - SIDE_BACK_Z;
const SIDE_CZ = (FRONT_Z + SIDE_BACK_Z) / 2;
// Color crema de pared pintada (tono base de la foto) de respaldo.
const SIDE_WALL_COLOR = "#cdbf9e";

const FLOOR_MAPS = {
  map: "/textures/floor/A23DTEX_Albedo.png",
  normalMap: "/textures/floor/A23DTEX_Normal.png",
  roughnessMap: "/textures/floor/A23DTEX_Roughness.png",
  // El nombre tiene espacio: lo codificamos para la URL.
  aoMap: "/textures/floor/A23DTEX_Ambient%20Occlusion.png",
};

/**
 * Habitación: piso con texturas PBR (albedo/normal/roughness/AO) + una pared de
 * fondo con la foto `wall.png` (cuarto noventoso con posters) y dos paredes
 * laterales lisas de color crema, alineadas a las esquinas del fondo. El `fog`
 * difumina los bordes lejanos.
 */
export function Room() {
  const floor = useTexture(FLOOR_MAPS) as Record<string, Texture>;
  // Texturas de pared (fondo / izquierda / derecha). El blur lo hace el DOF.
  const [wall, setWall] = useState<Texture | null>(null);
  const [leftTex, setLeftTex] = useState<Texture | null>(null);
  const [rightTex, setRightTex] = useState<Texture | null>(null);

  // Refs a los materiales de pared: aplicamos la textura de forma IMPERATIVA y
  // marcamos needsUpdate. Si solo pasáramos `map` por props al material que se
  // creó sin map, R3F puede no recompilar el shader y la pared queda en gris.
  const backMat = useRef<MeshStandardMaterial>(null);
  const leftMat = useRef<MeshStandardMaterial>(null);
  const rightMat = useRef<MeshStandardMaterial>(null);

  useEffect(() => {
    for (const [key, tex] of Object.entries(floor)) {
      tex.wrapS = tex.wrapT = RepeatWrapping;
      tex.repeat.set(FLOOR_REPEAT, FLOOR_REPEAT);
      tex.anisotropy = 8;
      // Solo el albedo va en espacio sRGB; el resto son datos lineales.
      tex.colorSpace = key === "map" ? SRGBColorSpace : NoColorSpace;
      tex.needsUpdate = true;
    }
  }, [floor]);

  useEffect(() => {
    let disposed = false;
    const load = (url: string, set: (t: Texture | null) => void) => {
      loadTexture(url).then((tex) => {
        if (disposed) {
          tex?.dispose();
          return;
        }
        set(tex);
      });
    };
    load("/textures/wall.png", setWall);
    load("/textures/left.png", setLeftTex);
    load("/textures/right.png", setRightTex);
    return () => {
      disposed = true;
    };
  }, []);

  // Aplicar cada textura a su material en cuanto cargue, forzando recompilación
  // del shader (si no, al setear el map tarde, R3F deja la pared en gris).
  useEffect(() => {
    const apply = (
      mat: MeshStandardMaterial | null,
      tex: Texture | null,
    ) => {
      if (!mat || !tex) return;
      mat.map = tex;
      mat.color.set("#ffffff");
      mat.needsUpdate = true;
    };
    apply(backMat.current, wall);
    apply(leftMat.current, leftTex);
    apply(rightMat.current, rightTex);
  }, [wall, leftTex, rightTex]);

  const wallY = FLOOR_Y + WALL_H / 2;

  return (
    <group>
      {/* Piso */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, FLOOR_Y, 0]}
        receiveShadow
      >
        <planeGeometry args={[60, 60]} />
        <meshStandardMaterial
          map={floor.map}
          normalMap={floor.normalMap}
          roughnessMap={floor.roughnessMap}
          aoMap={floor.aoMap}
          metalness={1}
          roughness={2}
          envMapIntensity={0}
        />
      </mesh>

      {/* Pared del fondo (detrás de la TV): foto de posters desenfocada.
          Un poco más ancha (BACK_W) para tapar el canto de los laterales. */}
      <mesh position={[0, wallY, BACK_Z]} receiveShadow>
        <planeGeometry args={[BACK_W, WALL_H]} />
        <meshStandardMaterial
          ref={backMat}
          color={SIDE_WALL_COLOR}
          roughness={0.95}
          metalness={0}
        />
      </mesh>

      {/* Pared izquierda (left.png desenfocada), alineada a la esquina del fondo. */}
      <mesh
        position={[-SIDE_X, wallY, SIDE_CZ]}
        rotation={[0, Math.PI / 2, 0]}
        receiveShadow
      >
        <planeGeometry args={[SIDE_DEPTH, WALL_H]} />
        <meshStandardMaterial
          ref={leftMat}
          color={SIDE_WALL_COLOR}
          roughness={0.95}
          metalness={0}
        />
      </mesh>

      {/* Pared derecha (right.png desenfocada). */}
      <mesh
        position={[SIDE_X, wallY, SIDE_CZ]}
        rotation={[0, -Math.PI / 2, 0]}
        receiveShadow
      >
        <planeGeometry args={[SIDE_DEPTH, WALL_H]} />
        <meshStandardMaterial
          ref={rightMat}
          color={SIDE_WALL_COLOR}
          roughness={0.95}
          metalness={0}
        />
      </mesh>
    </group>
  );
}
