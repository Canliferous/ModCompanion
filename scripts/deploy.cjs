// scripts/deploy.js
const fs = require("fs-extra");
const path = require("path");

async function deploy() {
    const appSrcPath = path.resolve(__dirname, "../build_dist");
    const appOutputPath = path.resolve(
        __dirname,
        "E:\\Licensee\\PortalRevolution\\revo2\\tools\\mod_companion\\app\\build",
    );

    await fs.ensureDir(appOutputPath);
    await fs.copy(appSrcPath, appOutputPath);
    console.log("✅ Deployed to app");

    const docsSrcPath = path.resolve(__dirname, "../docs");
    const docsOoutputPath = path.resolve(
        __dirname,
        "E:\\Licensee\\PortalRevolution\\revo2\\tools\\mod_companion\\docs",
    );
    await fs.ensureDir(docsSrcPath);
    await fs.copy(docsSrcPath, docsOoutputPath);
    console.log("✅ Deployed docs");
}

deploy();
