import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Open Image Templates",
    short_name: "OIT",
    description: "A free, open standard and community gallery for reusable AI image generation templates.",
    start_url: "/",
    display: "standalone",
    background_color: "#f5f3ef",
    theme_color: "#08090d",
    icons: [
      {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/apple-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
