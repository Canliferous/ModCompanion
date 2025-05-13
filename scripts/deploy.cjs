// scripts/deploy.js
const fs = require("fs-extra");
const path = require("path");

const buildSrcPath = path.resolve(__dirname, "../build");
const outputPath = path.resolve(__dirname, "E:\\Licensee\\PortalRevolution\\revo2\\mod_companion\\app\\build");

async function deploy() {
    await fs.ensureDir(outputPath);
    await fs.copy(buildSrcPath, outputPath);
    console.log("✅ Deployed to binary-repo/app");
}

deploy();
