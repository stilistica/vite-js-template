import { resolve } from "path";
import handlebars from "vite-plugin-handlebars";
import hulakTools from "vite-plugin-hulak-tools";
import path from "path";
import Inspect from "vite-plugin-inspect";
import { defineConfig } from "vite";
import fullReload from "vite-plugin-full-reload";

const pages = ["index.html", "pages/second.html"];
const repoBase = "/"; //приклад для Гіт Хаб "/ClubTravel/"

export default defineConfig({
  base: repoBase,
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  plugins: [
    Inspect(),
    handlebars({
      partialDirectory: resolve(__dirname, "src/components"),
      helpers: {
        link: (path) => repoBase + path,
      },
    }),
    hulakTools({
      enableHandlebars: true,
      handlebarsOptions: {
        partialDirectory: resolve(__dirname, "src/components"), // твої components
      },
    }),
    fullReload(["src/components/**/*.html"]),
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
