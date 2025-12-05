import { resolve } from "path";
import handlebars from "vite-plugin-handlebars";
import hulakTools from "vite-plugin-hulak-tools";
import path from "path";
import Inspect from "vite-plugin-inspect";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";
import { defineConfig } from "vite";
import fullReload from "vite-plugin-full-reload";

const pages = ["index.html", "pages/second.html"];

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  plugins: [
    Inspect(),
    handlebars({
      partialDirectory: resolve(__dirname, "src/components"),
    }),
    hulakTools({
      enableHandlebars: true,
      handlebarsOptions: {
        partialDirectory: resolve(__dirname, "src/components"), // твої components
      },
    }),
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
    fullReload([
      "src/components/**/*.html", 
    ]),
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
  server: {
    open: true,
    port: 5173,
    strictPort: true,
    fs: {
      strict: false, // дозволяє слідкувати за файлами поза коренем
    },
    watch: {
      usePolling: true,
    },
  },
});
