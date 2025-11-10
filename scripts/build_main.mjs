import * as esbuild from "esbuild";

await esbuild.build({
    entryPoints: ["./src/main/main.ts"],
    bundle: true,
    platform: "node",
    outfile: "./build_dist/main/main.cjs",
    external: ["electron"],
    define: {
        "import.meta.url": "__IMPORT_META_URL__",
    },
    banner: {
        js: "const __IMPORT_META_URL__ = 'file://' + __filename;",
    },
});
