export type Project = {
  /** Identificador único, también usado como key */
  id: string;
  /** Título que se muestra en la etiqueta del VHS y en la pantalla */
  title: string;
  /** Subtítulo / categoría breve */
  subtitle: string;
  /** Descripción corta para el overlay de UI */
  description: string;
  /** URL a la que redirigimos al "reproducir" el proyecto */
  url: string;
  /** Color principal del VHS y del brillo de la pantalla (hex) */
  color: string;
  /** Año o etiqueta corta para la estética retro */
  year: string;
};

/**
 * Cada proyecto del portfolio es un cassette VHS.
 * Al seleccionar un VHS se "inserta" en la TV y se previsualiza en la PC.
 * Reemplazá estos datos por tus proyectos reales.
 */
export const projects: Project[] = [
  {
    id: "neon-shop",
    title: "Fudi",
    subtitle: "App de delivery",
    description:
      "Tienda online con configurador de productos en tiempo real y checkout sin fricción.",
    url: "http://localhost:3000/projects/fudi",
    color: "#FF0000",
    year: "01",
  },
  {
    id: "synth-dashboard",
    title: "Photoi",
    subtitle: "Banco de imagenes \n generadas con IA",
    description:
      "Panel de analítica con visualizaciones interactivas y modo tiempo real.",
    url: "http://localhost:3000/projects/photoi",
    color: "#ff4d6d",
    year: "02",
  },
  {
    id: "arcade-game",
    title: "Deck game",
    subtitle: "Juego de estrategia \n por turnos",
    description:
      "Roguelike por turnos con sistema de cartas, clases y enemigos aleatorios por piso.",
    url: "http://localhost:3000/projects/deck-game/index.html",
    color: "#7c4dff",
    year: "04",
  },
];

/** El proyecto que se carga clickeando la consola (no aparece como VHS flotante). */
export const CONSOLE_GAME_ID = "arcade-game";

/** Proyectos que existen como cassettes VHS flotantes (todos menos el de la consola). */
export const tapeProjects = projects.filter((p) => p.id !== CONSOLE_GAME_ID);

/** Proyecto asociado a la consola. */
export const consoleProject =
  projects.find((p) => p.id === CONSOLE_GAME_ID) ?? null;
