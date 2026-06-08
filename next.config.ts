import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fija la raíz del proyecto para evitar el warning por lockfiles externos.
  turbopack: {
    root: __dirname,
    // Permite importar SVGs como componentes React (SVGR), usado por el
    // proyecto Photoi (`import Icon from "./icon.svg"` -> <Icon />).
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
    },
  },
};

export default nextConfig;
