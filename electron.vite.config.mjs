import { defineConfig, externalizeDepsPlugin } from "electron-vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    build: {
      rollupOptions: {
        external: ["electron"],
        input: {
          index: "./main/main.js",
        },
      },
    },
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
    build: {
      rollupOptions: {
        external: ["electron"],
        input: {
          index: "./preload/preload.js",
        },
      },
    },
  },
  renderer: {
    root: "./renderer",
    build: {
      rollupOptions: {
        input: {
          index: "./renderer/index.html",
        },
      },
    },
    plugins: [react(), tailwindcss()],
  },
});
