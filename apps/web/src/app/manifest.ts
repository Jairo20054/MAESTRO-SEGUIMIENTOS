import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Maestro — Centro de progreso personal",
    short_name: "Maestro",
    description: "Estudia, crea, crece y revisa tu progreso desde un solo lugar.",
    start_url: "/",
    display: "standalone",
    background_color: "#f4f1e8",
    theme_color: "#2f6657",
    lang: "es",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" }],
  };
}
