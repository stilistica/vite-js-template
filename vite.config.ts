import { resolve } from "path";
import path from "path";
import Inspect from "vite-plugin-inspect";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";
import { defineConfig } from "vite";

const pages = [
  "index.html",
  "pages/second.html",
];

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  plugins: [
    ViteImageOptimizer({
      png: {
        quality: 75,
      },
      jpeg: {
        quality: 75,
      },
      jpg: {
        quality: 75,
      },
      tiff: {
        quality: 75,
      },
      webp: {
        lossless: true,
      },
      avif: {
        lossless: true,
      },
      cache: false,
      cacheLocation: undefined,
    }),
    Inspect(),
  ],

  build: {
    outDir: "docs",
    emptyOutDir: true,
    rollupOptions: {
      input: Object.fromEntries(
        pages.map((page) => [
          page.replace(".html", ""),
          resolve(__dirname, page),
        ])
      ),
    },
  },

  envPrefix: "APP_",
});
