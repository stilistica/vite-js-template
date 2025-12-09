import { defineConfig } from "vite";
import path from "path";
import { resolve } from "path";
import { glob } from "glob";
// @ts-ignore
import handlebars from "vite-plugin-handlebars";
import { hulakPlugins } from "vite-plugin-hulak-tools";
import injectHTML from "vite-plugin-html-inject";
import FullReload from "vite-plugin-full-reload";
import { createHtmlPlugin } from "vite-plugin-html";
import Inspect from "vite-plugin-inspect";

const repoBase = "/vite-js-template/"; //приклад для Гіт Хаб "/ClubTravel/"
const partialDir = [resolve(__dirname, "src/components")];

export default defineConfig(({ command }) => {
  return {
    base: repoBase,
    root: "src",
    appType: "mpa",
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
        partialDirectory: partialDir,
        helpers: {
          link: (p) => repoBase + p,
        },
      }),
      hulakPlugins({
        enableHandlebars: true,
        handlebarsOptions: {
          partialDirectory: resolve(__dirname, "src/components"),
        },
      }),
      createHtmlPlugin({
        minify: true,
        // @ts-ignore
        collapseWhitespace: true,
        removeComments: true,
        removeEmptyAttributes: true,
        removeRedundantAttributes: true,
        minifyCSS: true,
        minifyJS: true,
      }),
      injectHTML(),
      FullReload(["./src/**/**.html"]),
    ],

    build: {
      outDir: "../dist",
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
    server: {
      watch: {
        usePolling: true,
      },
    },
  };
});
