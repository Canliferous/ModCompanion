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
                    primary: "magenta",
                },
                badge: {
                    slots: {
                        base: "select-none",
                    },
                    compoundVariants: [
                        {
                            color: "success",
                            variant: "label",
                            class: "bg-none text-success",
                        },
                    ],
                },
                button: {
                    slots: {
                        base: "cursor-pointer",
                    },
                    variants: {
                        variant: {
                            solid: "inset-shadow-rim",
                        },
                    },
                    compoundVariants: [
                        {
                            color: "neutral",
                            variant: "solid",
                            class: "bg-neutral-800 hover:bg-neutral-750 active:bg-neutral-850 disabled:bg-neutral-900 text-neutral-100 shadow-xs shadow-neutral-950/50",
                        },
                    ],
                    defaultVariants: {
                        color: "neutral",
                        variant: "solid",
                        size: "md",
                    },
                },
                select: {
                    slots: {
                        base: "cursor-pointer",
                        content: "shadow-md inset-shadow-rim shadow-md shadow-neutral-950",
                    },
                    variants: {
                        variant: {
                            outline: "hover:bg-elevated active:bg-elevated",
                            lowered:
                                "bg-neutral-900 hover:bg-neutral-850 inset-shadow-cave shadow-neutral-950 ring-transparent border border-accented outline-primary-500 outline-2 outline-none focus-visible:outline-solid",
                        },
                    },
                    defaultVariants: {
                        color: "primary",
                        variant: "lowered",
                        size: "md",
                    },
                },
                popover: {
                    slots: {
                        // Above dockview divider lines which are at 99
                        content: "z-100",
                    },
                },
                contextMenu: {
                    slots: {
                        // Above dockview divider lines which are at 99
                        content: "z-100",
                    },
                },
                tooltip: {
                    slots: {
                        // Above dockview divider lines which are at 99
                        content: "z-100",
                    },
                },
                modal: {
                    slots: {
                        // Above dockview divider lines which are at 99
                        content: "z-100",
                    },
                },
                formField: {
                    slots: {
                        root: "p-2 bg-neutral-800 rounded-lg",
                        label: "mx-1",
                    },
                },
                input: {
                    slots: {
                        base: "",
                    },
                    variants: {
                        variant: {
                            lowered:
                                "bg-neutral-900 hover:bg-neutral-850 inset-shadow-cave shadow-neutral-950 ring-transparent border border-accented outline-primary-500 outline-2 outline-none focus-visible:outline-solid",
                        },
                    },
                    defaultVariants: {
                        color: "primary",
                        variant: "lowered",
                        size: "md",
                    },
                },
                textarea: {
                    slots: { base: "hover:bg-elevated duration-0" },
                },
                inputNumber: {
                    slots: { base: "hover:bg-elevated duration-0" },
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
