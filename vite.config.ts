import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
import { VitePWA } from "vite-plugin-pwa";

const explicitBase = process.env.VITE_BASE_PATH;
const repoName = process.env.GITHUB_REPOSITORY?.split("/")[1];

const base = explicitBase ?? (repoName ? `/${repoName}/` : "/");

export default defineConfig({
  base,
  plugins: [
    solidPlugin(),
    VitePWA({
      strategies: "injectManifest",
      srcDir: "src",
      filename: "sw.ts",
      registerType: "autoUpdate",
      devOptions: {
        enabled: true,
      },
      includeAssets: ["icons/icon-192.png", "icons/icon-512.png", "icons/apple-touch-icon.png"],
      manifest: {
        name: "being better",
        short_name: "being better",
        description: "Track daily wellbeing ratings.",
        theme_color: "#1f6d8a",
        background_color: "#f4f8fb",
        display: "standalone",
        scope: base,
        start_url: base,
        icons: [
          {
            src: "icons/icon-192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "icons/icon-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "icons/icon-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
    }),
  ],
});
