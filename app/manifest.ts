import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "AI Match Companion",
    short_name: "AI Match",
    description:
      "Análisis inteligente de partidos de fútbol con IA. Sigue a tus selecciones nacionales favoritas.",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0a0a",
    theme_color: "#0a0a0a",
    icons: [
      {
        src: "/assets/img/ai-companion-logo.png",
        sizes: "any",
        type: "image/png",
      },
    ],
  };
}
