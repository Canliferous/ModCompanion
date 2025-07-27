import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import ui from "@nuxt/ui/vite";

// https://vitejs.dev/config
export default defineConfig({
    plugins: [
        vue(),
        ui({
            components: {
                dts: "./src/renderer/components.d.ts",
                dirs: ["./src/renderer/components"],
                extensions: ["vue"],
                deep: true,
            },
            autoImport: {
                vueDirectives: true,
                vueTemplate: true,
                dts: "./src/renderer/auto-imports.d.ts",
                imports: ["vue"],
            },
            ui: {
                colors: {
                    primary: "fuchsia",
                },
                button: { slots: { base: "cursor-pointer duration-0" } },
                select: {
                    slots: { base: "cursor-pointer duration-0" },
                    variants: { variant: { outline: "hover:bg-elevated active:bg-elevated" } },
                },
                popover: {
                    slots: {
                        // Above dockview divier lines which are at 99
                        content: "z-100",
                    },
                },
                checkbox: {
                    slots: { root: "cursor-pointer select-none" },
                    variants: { variant: { card: { root: "hover:bg-elevated" } } },
                    compoundVariants: [
                        {
                            size: "md",
                            variant: "card",
                            class: {
                                root: "p-2",
                            },
                        },
                    ],
                },
                icons: {
                    arrowLeft: "tdesign:arrow-left",
                    arrowRight: "tdesign:arrow-right",
                    check: "tdesign:check",
                    chevronDoubleLeft: "tdesign:chevron-left-double",
                    chevronDoubleRight: "tdesign:chevron-right-double",
                    chevronDown: "tdesign:chevron-down",
                    chevronLeft: "tdesign:chevron-left",
                    chevronRight: "tdesign:chevron-right",
                    chevronUp: "tdesign:chevron-up",
                    close: "tdesign:close",
                    ellipsis: "tdesign:ellipsis",
                    external: "tdesign:arrow-right-up",
                    folder: "tdesign:folder",
                    folderOpen: "tdesign:folder-open",
                    loading: "tdesign:load",
                    minus: "tdesign:minus",
                    plus: "tdesign:plus",
                    search: "tdesign:search",
                },
            },
        }),
    ],
    base: "./",
    build: {
        outDir: "build_dist/renderer",
    },
    resolve: {
        alias: {
            "~": "/src/renderer",
            Shared: "/src/shared",
        },
    },
});
