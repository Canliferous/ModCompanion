import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import ui from "@nuxt/ui/vite";
import uiconfig from "./uiconfig";

// https://vitejs.dev/config
export default defineConfig({
    plugins: [vue(), ui(uiconfig())],
    base: "./",
    build: {
        outDir: "build_dist/renderer",
        rollupOptions: {
            output: {
                entryFileNames: `index.js`,
                chunkFileNames: `chunks/[name].js`,
                assetFileNames: `assets/[name][extname]`,
            },
        },
    },
    resolve: {
        alias: {
            "~": "/src/renderer",
            Shared: "/src/shared",
        },
    },
    server: {
        watch: {
            ignored: ["**/sample/**"],
        },
    },
});
