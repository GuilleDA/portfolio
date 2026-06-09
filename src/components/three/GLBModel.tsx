"use client";

import { useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import {
  Mesh,
  MeshStandardMaterial,
  NearestFilter,
  Texture,
  type Material,
  type Object3D,
  type Vector3Tuple,
} from "three";

type GLBModelProps = {
  /** Ruta dentro de /public, ej: "/models/tv.glb" */
  url: string;
  position?: Vector3Tuple;
  rotation?: Vector3Tuple;
  scale?: number | Vector3Tuple;
};

/** Pasa una textura a filtrado nearest sin mipmaps (evita el bleeding de paletas). */
function sharpenTexture(tex: Texture | null | undefined) {
  if (!tex) return;
  tex.magFilter = NearestFilter;
  tex.minFilter = NearestFilter;
  tex.generateMipmaps = false;
  tex.needsUpdate = true;
}

/**
 * Sanea los materiales del .glb:
 *  - El tv.glb de Blender viene con alphaMode: BLEND aunque sea opaco → lo
 *    forzamos opaco (sino se renderiza semitransparente).
 *  - Es un modelo low-poly con textura tipo paleta; con filtrado lineal los
 *    colores vecinos "sangran" en las costuras UV (bordes amarillos/rojos).
 *    Pasamos las texturas a nearest sin mipmaps para cortar ese bleeding.
 */
function sanitizeMaterials(root: Object3D) {
  root.traverse((obj) => {
    if (!(obj instanceof Mesh)) return;
    const mats: Material[] = Array.isArray(obj.material)
      ? obj.material
      : [obj.material];
    for (const mat of mats) {
      mat.transparent = false;
      mat.opacity = 1;
      mat.depthWrite = true;
      if (mat instanceof MeshStandardMaterial) {
        sharpenTexture(mat.map);
        sharpenTexture(mat.emissiveMap);
      }
      mat.needsUpdate = true;
    }
  });
}

/**
 * Cargador genérico de modelos .glb / .gltf.
 */
export function GLBModel({
  url,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
}: GLBModelProps) {
  const { scene } = useGLTF(url);
  const model = useMemo(() => {
    const clone = scene.clone();
    sanitizeMaterials(clone);
    return clone;
  }, [scene]);

  return (
    <primitive
      object={model}
      position={position}
      rotation={rotation}
      scale={scale}
    />
  );
}

GLBModel.preload = (url: string) => useGLTF.preload(url);
