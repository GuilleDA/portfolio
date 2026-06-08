// SVGR: permite importar SVGs como componentes React.
// Sobrescribe el tipo por defecto de Next (`StaticImageData`) para los SVG
// que el proyecto Photoi usa como `import Icon from "./icon.svg"` -> <Icon />.
declare module "*.svg" {
  import type { FC, SVGProps } from "react";
  const ReactComponent: FC<SVGProps<SVGSVGElement>>;
  export default ReactComponent;
}
