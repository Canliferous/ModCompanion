// scripts/deploy.js
const fs = require("fs-extra");
const path = require("path");

async function deploy() {
    await _deployApp();
    await _deployDocs();
    await _deployRuntime();
}

async function _deployApp() {
    const appSrcPath = path.resolve(__dirname, "../build_dist");
    const appOutputPath = path.resolve(
        __dirname,
        "E:\\Licensee\\PortalRevolution\\revo2\\tools\\mod_companion\\app\\build",
    );

    await fs.ensureDir(appOutputPath);
    await fs.copy(appSrcPath, appOutputPath);
    console.log("✅ Deployed to app");
}

async function _deployDocs() {
    const docsSrcPath = path.resolve(__dirname, "../docs");
    const docsOoutputPath = path.resolve(
        __dirname,
        "E:\\Licensee\\PortalRevolution\\revo2\\tools\\mod_companion\\docs",
    );
    await fs.ensureDir(docsSrcPath);
    await fs.copy(docsSrcPath, docsOoutputPath);
    console.log("✅ Deployed docs");
}

async function _deployRuntime() {
    const runtimeSrcPath = path.resolve(__dirname, "../prod_runtime/out/mod_companion-win32-x64");
    const runtimeOutputPath = path.resolve(
        __dirname,
        "E:\\Licensee\\PortalRevolution\\revo2\\tools\\mod_companion\\electron_runtime_win64",
    );
    await fs.ensureDir(runtimeOutputPath);
    await fs.copy(runtimeSrcPath, runtimeOutputPath);
    console.log("✅ Deployed runtime");
}

deploy();
