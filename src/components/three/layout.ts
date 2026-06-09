import type { Vector3Tuple } from "three";

/**
 * Posiciones y medidas compartidas por la escena.
 *
 * Usamos el modelo `tv.glb` (TV + mueble + reproductor VHS arriba, todo en uno)
 * y `tape.glb` (el cassette). Las constantes de pantalla / ranura del VCR se
 * derivan de la geometría real del modelo:
 *   - El modelo mide ~1 x 1.453 x 1 y en el .glb el frente mira hacia -Z.
 *     Lo rotamos 180° en Y (TV_MODEL_ROTATION) para que mire a la cámara (+Z).
 *   - Pantalla: cara frontal del cuerpo (cube_5), ~86% del frente, hundida en el bisel.
 *   - Reproductor VHS (arriba): frente ≈ (0, 1.383, 0.188).
 *
 * Si algo no calza perfecto, poné DEBUG_MARKERS = true: vas a ver cubos de
 * colores en la pantalla (verde) y en la ranura del VCR (rojo) para ajustar
 * TV_SCREEN_*  y VCR_SLOT_WORLD a ojo. Después volvé a ponerlo en false.
 */

/** Marcadores visuales para alinear pantalla/ranura con el modelo. */
export const DEBUG_MARKERS = false;

/** Altura del piso. */
export const FLOOR_Y = -0.82;

// ---- Modelo del televisor (tv.glb) ----
export const TV_SCALE = 2.4;
/** Rotación del tv.glb: el asset exporta el frente hacia -Z, la cámara está en +Z. */
export const TV_MODEL_ROTATION: Vector3Tuple = [0, Math.PI, 0];
/** Posición del grupo de la TV (su base se apoya en el piso). */
export const TV_GROUP_POSITION: Vector3Tuple = [0, FLOOR_Y, 0];

// Medidas del cuerpo de la TV (malla cube_5 del .glb, antes de escalar):
const TV_BODY_FACE = { width: 1, height: 0.813, centerY: 0.906, frontZ: 0.4 };
/** Margen del bisel alrededor del vidrio (0.86 ≈ 86% del frente). */
const SCREEN_BEZEL = 0.86;
const VCR_LOCAL = { y: 1.383, z: 0.188 };

// ---- Pantalla CRT (dentro del marco, no flotando adelante) ----
export const TV_SCREEN_SIZE = {
  width: TV_BODY_FACE.width * TV_SCALE * SCREEN_BEZEL,
  height: TV_BODY_FACE.height * TV_SCALE * SCREEN_BEZEL,
};
/** Centro de la pantalla, relativo al grupo de la TV. */
export const TV_SCREEN_OFFSET: Vector3Tuple = [
  0,
  TV_BODY_FACE.centerY * TV_SCALE,
  // Ligeramente hundida en el hueco del bisel (antes +0.02 la empujaba afuera).
  TV_BODY_FACE.frontZ * TV_SCALE - 0.1,
];
/** Centro de la pantalla EN MUNDO (para el zoom de cámara). */
export const TV_SCREEN_WORLD: Vector3Tuple = [
  TV_GROUP_POSITION[0] + TV_SCREEN_OFFSET[0],
  TV_GROUP_POSITION[1] + TV_SCREEN_OFFSET[1],
  TV_GROUP_POSITION[2] + TV_SCREEN_OFFSET[2],
];

// ---- Ranura del reproductor VHS (objetivo al arrastrar un cassette) ----
export const VCR_SLOT_WORLD: Vector3Tuple = [
  TV_GROUP_POSITION[0],
  TV_GROUP_POSITION[1] + VCR_LOCAL.y * TV_SCALE,
  TV_GROUP_POSITION[2] + VCR_LOCAL.z * TV_SCALE + 0.06,
];
/** Distancia máxima al soltar para que el cassette se "inserte". */
export const VCR_DROP_RADIUS = 1.3;

// ---- Cassettes VHS flotantes (tape.glb) ----
export const TAPE_SCALE = 1.1;
/**
 * El pivote del tape.glb está descentrado; este offset lo recentra dentro de
 * su grupo (medido del .glb: centro ≈ [0, -0.061, -0.326]).
 */
export const TAPE_RECENTER: Vector3Tuple = [
  0,
  0.061 * TAPE_SCALE,
  0.326 * TAPE_SCALE,
];
/** Dimensiones del bounding box del tape.glb (root rotado 90° en X → parado). */
export const VHS_TAPE_BOX = [1.0, 0.643, 0.127] as const;
/** Medidas del tape ya escalado (etiqueta flotante encima). */
export const VHS_TAPE = {
  width: 1.0 * TAPE_SCALE,
  height: 0.127 * TAPE_SCALE,
  depth: 0.643 * TAPE_SCALE,
};
/**
 * Los cassettes FLOTAN en una fila por encima/delante de la TV, con un leve
 * balanceo. `getFloatHome(i, n)` devuelve la posición de cada uno.
 */
export const VHS_FLOAT = {
  y: 2.75, // por encima del tope del modelo (no tapa la pantalla)
  z: 2.85, // por delante de la TV (hacia la cámara)
  spreadX: 3.0, // ancho total de la fila
  bobAmp: 0.1,
  bobSpeed: 1.3,
};
export function getFloatHome(index: number, count: number): Vector3Tuple {
  const t = count > 1 ? index / (count - 1) - 0.5 : 0;
  return [t * VHS_FLOAT.spreadX, VHS_FLOAT.y, VHS_FLOAT.z];
}

// ---- Consola (console.glb), en el piso, al frente de la TV ----
export const CONSOLE_SCALE = 4.2;
/** El asset se apoya en y≈0; lo dejamos sobre el piso, al frente y a un costado. */
export const CONSOLE_POSITION: Vector3Tuple = [1.7, FLOOR_Y, 3.1];
/** Rotación para que el frente mire hacia la cámara (ajustable). */
export const CONSOLE_ROTATION: Vector3Tuple = [0, -Math.PI / 5, 0];
/**
 * El pivote del console.glb está descentrado (centro local ≈ [0.07, _, 0.146]).
 * Recentramos en X/Z para que el grupo quede centrado; la base sigue en el piso.
 */
export const CONSOLE_RECENTER: Vector3Tuple = [
  -0.07 * CONSOLE_SCALE,
  0,
  -0.146 * CONSOLE_SCALE,
];

/**
 * Botones PLAY / EJECT del reproductor VHS (coordenadas locales del grupo TV).
 * cube_10 del .glb: frente ≈ z 0.188, ancho ~0.75 → escalado ~1.8 de ancho.
 */
export const VCR_CONTROLS_OFFSET: Vector3Tuple = [
  0,
  VCR_LOCAL.y * TV_SCALE,
  VCR_LOCAL.z * TV_SCALE + 0.14,
];
/** Offset desde VCR_CONTROLS_OFFSET (x = izq/der, y = abajo del panel). */
export const VCR_PLAY_OFFSET: Vector3Tuple = [-0.32, -0.14, 0.05];
export const VCR_EJECT_OFFSET: Vector3Tuple = [0.32, -0.14, 0.05];
export const VCR_BUTTON_RADIUS = 0.13;

// ---- Cámara ----
export const CAMERA_DEFAULT = {
  position: [0.6, 3, 9.4] as Vector3Tuple,
  target: [0, 1.35, 0] as Vector3Tuple,
};
/** Encuadre final del zoom: la pantalla del TV casi a pantalla completa. */
export const CAMERA_ZOOM = {
  position: [
    TV_SCREEN_WORLD[0],
    TV_SCREEN_WORLD[1],
    TV_SCREEN_WORLD[2] + 1.9,
  ] as Vector3Tuple,
  target: TV_SCREEN_WORLD,
};

// ---- Celular (PHONE.glb) para la "vista mobile" ----
/**
 * Medidas del modelo PHONE.glb (mitad-extentes, medidas del .glb):
 *   - cuerpo: ~3.10 (x) × 0.49 (y) × 5.65 (z) → es una placa plana con el
 *     vidrio en la cara superior (+Y).
 *   - vidrio: zona inset de la cara superior.
 * Lo rotamos 90° en X (PHONE_ROTATION) para pararlo vertical con la pantalla
 * mirando a la cámara (+Z). Si la pantalla no calza, poné DEBUG_MARKERS = true
 * para ver el recuadro verde y ajustá PHONE_* a ojo.
 */
const PHONE_BODY = { hx: 1.552, hy: 0.2465, hz: 2.8266 };
const PHONE_GLASS = { hx: 1.473, hz: 2.682 };
export const PHONE_SCALE = 0.12;
/** Parado vertical, con la pantalla (cara superior del modelo) mirando a +Z. */
export const PHONE_ROTATION: Vector3Tuple = [Math.PI / 2, 0, 0];
/**
 * Transform del celular "en la mano": es relativo a la CÁMARA (tipo HUD), así
 * que siempre aparece sostenido frente a vos. La cámara apunta hacia abajo
 * (CAMERA_MOBILE) para simular que mirás tu mano.
 *   - position: [x derecha, y abajo(-), z adelante(-)] en espacio de cámara.
 *   - rotation: inclinación del celular (x negativo = la pantalla mira hacia vos).
 */
export const PHONE_HELD = {
  position: [0, -0.05, -1.4] as Vector3Tuple,
  rotation: [-0.35, 0, 0] as Vector3Tuple,
};
/** Cuánto sube el celular en la animación de entrada (desde abajo de cuadro). */
export const PHONE_ENTRY_DROP = 1.3;
/**
 * Espera (en segundos) antes de que el celular suba, para que primero la cámara
 * termine de mirar hacia abajo y recién después aparezca el celular.
 */
export const PHONE_ENTRY_DELAY = 0.9;
/** Medidas de la pantalla del celular (ya escalada). La pantalla es rectangular
 * y llena el vidrio del modelo. */
export const PHONE_SCREEN_SIZE = {
  width: PHONE_GLASS.hx * 2 * PHONE_SCALE,
  height: PHONE_GLASS.hz * 2 * PHONE_SCALE,
};
/** Centro de la pantalla relativo al grupo del celular (cara frontal +Z). */
export const PHONE_SCREEN_OFFSET: Vector3Tuple = [
  0,
  0,
  PHONE_BODY.hy * PHONE_SCALE + 0.006,
];
/** Encuadre de la cámara en vista mobile: misma posición que el zoom pero
 * mirando hacia abajo (como cuando bajás la vista a tu mano). */
export const CAMERA_MOBILE = {
  position: CAMERA_ZOOM.position,
  target: [
    TV_SCREEN_WORLD[0],
    TV_SCREEN_WORLD[1] - 2.0,
    TV_SCREEN_WORLD[2],
  ] as Vector3Tuple,
};
