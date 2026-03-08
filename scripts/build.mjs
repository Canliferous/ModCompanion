import * as esbuild from "esbuild";
import fs from "node:fs/promises";
import path from "node:path";

const mainOptions = {
    entryPoints: ["./src/main/main.ts"],
    bundle: true,
    platform: "node",
    outfile: "./build/main/main.cjs",
    external: ["electron"],
    define: {
        "import.meta.url": "__IMPORT_META_URL__",
    },
    banner: {
        js: "const __IMPORT_META_URL__ = 'file://' + __filename;",
    },
};

const cliOptions = {
    entryPoints: ["./src/cli/main.ts"],
    bundle: true,
    platform: "node",
    outfile: "./build/cli/main.cjs",
    external: ["electron"],
    define: {
        "import.meta.url": "__IMPORT_META_URL__",
    },
    banner: {
        js: "const __IMPORT_META_URL__ = 'file://' + __filename;",
    },
};

async function getWorkersOptions() {
    const workersDir = "./src/core/workers";

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

    return {
        entryPoints,
        outdir: "./build/core/workers",
        outbase: workersDir,
        platform: "node",
        bundle: true,
    };
}

async function run() {
    const doWatch = process.argv.length > 2 && process.argv[2] === "watch";
    if(doWatch) {
        const mainCtx = await esbuild.context(mainOptions);
        const cliCtx = await esbuild.context(cliOptions);
        const workersCtx = await esbuild.context(await getWorkersOptions());

        const promises = [mainCtx.watch(), cliCtx.watch(), workersCtx.watch()];
        await Promise.allSettled(promises);
    } else {
        await esbuild.build(mainOptions);
        await esbuild.build(cliOptions);
        await esbuild.build(await getWorkersOptions());
    }
}

run();