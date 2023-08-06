import { defineConfig, loadEnv } from "vite";
import preact from "@preact/preset-vite";
import { VitePWA } from "vite-plugin-pwa";

const { NODE_ENV } = process.env;
const {
  VITE_APPLICATION_NAME: APPLICATION_NAME,
  VITE_APPLICATION_ID: APPLICATION_ID,
} = loadEnv("production", process.cwd());

// Getting hash and version
import { execSync } from "child_process";
import { readFileSync } from "fs";
const commitHash = execSync("git rev-parse --short HEAD").toString().trim();
const packageJson = JSON.parse(
  readFileSync("./package.json").toString("utf-8"),
);

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    __COMMIT_HASH__: JSON.stringify(commitHash),
    __APP_VERSION__: JSON.stringify(packageJson.version),
  },
  plugins: [
    preact(),
    VitePWA({
      registerType: "autoUpdate",
      devOptions: {
        enabled: NODE_ENV === "development",
        type: "module",
      },
      manifest: {
        id: APPLICATION_ID,
        name: APPLICATION_NAME,
        short_name: APPLICATION_NAME,
        description: "A modern and customizable Mastodon web client",
        theme_color: "#ffffff",
        icons: [
          {
            src: "pwa-64x64.png",
            sizes: "64x64",
            type: "image/png",
          },
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "maskable-icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
    }),
  ],
  server: {
    host: "0.0.0.0",
  },
});
