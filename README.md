# Retro/VHS · Portfolio 3D

Portfolio interactivo en 3D: un **mueble** con un **reproductor VCR**, una **TV
retro** encima y una **pila de cassettes VHS** al costado, donde **cada VHS es
un proyecto**. Al seleccionar un cassette de la pila, el proyecto se previsualiza
en la pantalla del TV (y en el display del VCR). Al hacer **click en la TV** (o en
"Reproducir"), la cámara hace **zoom hacia la pantalla** y luego **redirige** a la
página del proyecto.

## Stack

- **Next.js** (App Router, TypeScript)
- **React Three Fiber** + **@react-three/drei** (escena y helpers 3D)
- **three.js**
- **GSAP** (animación de cámara / zoom) y **Framer Motion** (UI 2D)
- **Tailwind CSS** (estilos de la UI)
- Assets **.glb / .gltf** (placeholders por ahora; ver `public/models`)

## Empezar

```bash
npm run dev
```

Abrí [http://localhost:3000](http://localhost:3000).

## Cómo funciona el flujo

1. **Seleccionar un VHS** → en la escena 3D (pila de cassettes al costado) o
   desde la barra de proyectos del overlay. Esto define el "proyecto activo".
2. **Previsualización** → el proyecto activo se muestra en la pantalla del TV y
   en el display del reproductor VCR.
3. **Reproducir** → click en la TV en 3D o en el botón del overlay. La cámara
   hace zoom a la pantalla del TV (GSAP) y al terminar redirige a `project.url`.

## Estructura

```
src/
├─ app/
│  ├─ layout.tsx          # Metadata + layout raíz
│  └─ page.tsx            # Monta el Canvas (sin SSR) + overlay, dentro del provider
├─ data/
│  └─ projects.ts         # ← Editá acá tus proyectos (cada uno = un VHS)
├─ store/
│  └─ experience.tsx      # Estado compartido (VHS activo, estado del zoom)
└─ components/
   ├─ ui/
   │  └─ Overlay.tsx      # UI 2D con Framer Motion (selector + ficha + transición)
   └─ three/
      ├─ SceneCanvas.tsx  # <Canvas> de R3F + Loader de drei
      ├─ Experience.tsx   # Luces, entorno, sombras y objetos
      ├─ RetroTV.tsx      # TV retro clickeable que dispara el zoom (placeholder)
      ├─ Cabinet.tsx      # Mueble + reproductor VCR (display del proyecto activo)
      ├─ VHSStack.tsx     # Pila de cassettes (uno por proyecto)
      ├─ CRTScreen.tsx    # Pantalla CRT reutilizable
      ├─ CameraRig.tsx    # OrbitControls + zoom con GSAP
      ├─ GLBModel.tsx     # Cargador genérico de .glb / .gltf
      └─ layout.ts        # Posiciones/medidas compartidas (cámara ↔ TV)
```

## Personalizar

- **Proyectos**: editá `src/data/projects.ts` (título, color, descripción y `url`).
- **Assets 3D**: ver `public/models/README.md` para reemplazar los placeholders
  por modelos `.glb` reales.
- **Encuadre del zoom**: ajustá `CAMERA_ZOOM` / `TV_SCREEN_CENTER` en
  `src/components/three/layout.ts`.

## Build

```bash
npm run build && npm run start
```
