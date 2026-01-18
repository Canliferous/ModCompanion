import * as esbuild from "esbuild";
import fs from "node:fs/promises";
import path from "path";

function buildMain() {
    return esbuild.build({
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
}

async function buildWorkers() {
    const workersDir = "./src/main/workers";

    const entries = await fs.readdir(workersDir, { recursive: true });

    const entryPoints = [];
    for (const entry of entries) {
        const filePath = path.join(workersDir, entry);
        const stat = await fs.stat(filePath);
        if (stat.isFile()) {
            console.log("Found worker", filePath);
            entryPoints.push(filePath);
        }
    }

    esbuild.build({
        entryPoints,
        outdir: "./build_dist/main/workers",
        outbase: workersDir,
        platform: "node",
        bundle: true,
    });
}

buildMain().then(buildWorkers);
