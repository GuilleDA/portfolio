# Modelos 3D (.glb / .gltf)

Dejá acá tus assets, por ejemplo:

- `tv.glb` — el televisor retro
- `computer.glb` — la PC / monitor
- `vhs.glb` — el cassette (se reutiliza por proyecto)

## Cómo enchufarlos

Los componentes en `src/components/three/` (`RetroTV.tsx`, `Computer.tsx`,
`VHSShelf.tsx`) hoy usan primitivas como placeholder. Para usar un modelo real,
reemplazá la geometría por el cargador `GLBModel`:

```tsx
import { GLBModel } from "./GLBModel";

<GLBModel url="/models/tv.glb" position={TV_POSITION} scale={1} />;
```

Y precargá el asset (fuera del componente) para evitar parpadeos:

```tsx
GLBModel.preload("/models/tv.glb");
```

## Consejos

- Mantené la posición de la **pantalla** del TV alineada con
  `TV_SCREEN_CENTER` en `src/components/three/layout.ts`, o ajustá esa constante
  al modelo. La cámara hace zoom hacia ese punto.
- Optimizá los `.glb` con [gltf-transform](https://gltf-transform.dev/) o
  [Draco](https://github.com/google/draco) para que pesen menos.
- Podés autogenerar el componente JSX de un modelo con
  [`gltfjsx`](https://github.com/pmndrs/gltfjsx): `npx gltfjsx tv.glb`.
