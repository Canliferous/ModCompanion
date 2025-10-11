const fs = require("fs-extra");
const path = require("path");

const output = "/mnt/m/Git/PortalRevolution2/tools/mod_companion";

async function deploy() {
    await _deployApp();
    await _deployDocs();
    await _deployRuntimeWindows();
    await _deployRuntimeLinux();
}

async function _deployApp() {
    const appSrcPath = path.resolve(__dirname, "../build_dist");
    const appOutputPath = path.resolve(__dirname, `${output}/app/build`);

    await fs.ensureDir(appOutputPath);
    await fs.copy(appSrcPath, appOutputPath);
    console.log("✅ Deployed to app");
}

async function _deployDocs() {
    const docsSrcPath = path.resolve(__dirname, "../docs");
    const docsOoutputPath = path.resolve(__dirname, `${output}/docs`);
    await fs.ensureDir(docsSrcPath);
    await fs.copy(docsSrcPath, docsOoutputPath);
    console.log("✅ Deployed docs");
}

async function _deployRuntimeWindows() {
    const runtimeSrcPath = path.resolve(__dirname, "../prod_runtime/out/mod_companion-win32-x64");
    const runtimeOutputPath = path.resolve(__dirname, `${output}/electron_runtime_win64`);
    await fs.ensureDir(runtimeOutputPath);
    await fs.copy(runtimeSrcPath, runtimeOutputPath);
    console.log("✅ Deployed windows runtime");
}

async function _deployRuntimeLinux() {
    const runtimeSrcPath = path.resolve(__dirname, "../prod_runtime/out/mod_companion-linux-x64");
    const runtimeOutputPath = path.resolve(__dirname, `${output}/electron_runtime_linux64`);
    await fs.ensureDir(runtimeOutputPath);
    await fs.copy(runtimeSrcPath, runtimeOutputPath);
    console.log("✅ Deployed linux runtime");
}

deploy();
