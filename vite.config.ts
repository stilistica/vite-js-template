import { defineConfig } from "vite";
import path from "path";
import { resolve } from "path";
import { glob } from "glob";
import handlebars from "vite-plugin-handlebars";
import hulakTools from "vite-plugin-hulak-tools";
import injectHTML from "vite-plugin-html-inject";
import FullReload from "vite-plugin-full-reload";
import Inspect from "vite-plugin-inspect";

const repoBase = "/vite-js-template/"; //приклад для Гіт Хаб "/ClubTravel/"

export default defineConfig(({ command }) => {
  return {
    base: repoBase,
    root: "src",
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    define: {
      [command === "serve" ? "global" : "_global"]: {},
    },

    plugins: [
      Inspect(),
      handlebars({
        partialDirectory: resolve(__dirname, "src/components"),
        helpers: {
          link: (p) => repoBase + p,
        },
      }),
      hulakTools({
        enableHandlebars: true,
        handlebarsOptions: {
          partialDirectory: resolve(__dirname, "src/components"),
        },
      }),
      injectHTML(),
      FullReload(["./src/**/**.html"]),
    ],

    build: {
      outDir: "../docs",
      emptyOutDir: true,
      rollupOptions: {
        input: {
          main: resolve(__dirname, "src/index.html"),

          ...Object.fromEntries(
            glob
              .sync("./src/pages/*.html")
              .map((file) => [
                file.replace("./src/pages/", "").replace(".html", ""),
                resolve(__dirname, file),
              ])
          ),
        },
        output: {
          manualChunks(id) {
            if (id.includes("node_modules")) {
              return "vendor";
            }
          },
          entryFileNames: (chunkInfo) => {
            if (chunkInfo.name === "commonHelpers") {
              return "commonHelpers.js";
            }
            return "[name].js";
          },
          assetFileNames: (assetInfo) => {
            if (assetInfo.name?.endsWith(".html")) {
              return "[name].[ext]";
            }
            if (
              assetInfo.name?.endsWith(".woff2") ||
              assetInfo.name?.endsWith(".woff")
            ) {
              return "fonts/[name]-[hash][extname]";
            }

            return "assets/[name]-[hash][extname]";
          },
        },
      },
    },

    // envPrefix: "APP_",
    // server: {
    //   open: true,
    //   port: 5173,
    //   strictPort: true,
    //   fs: {
    //     strict: false, // дозволяє слідкувати за файлами поза коренем
    //   },
    //   watch: {
    //     usePolling: true,
    //   },
    // },
  };
});
