// scripts/deploy.js
const fs = require("fs-extra");
const path = require("path");

const distPath = path.resolve(__dirname, "../dist");
const buildPath = path.resolve(__dirname, "../build");
const outputPath = path.resolve(
  __dirname,
  "E:\\Licensee\\PortalRevolution\\revo2\\mod_companion\\app",
);

async function deploy() {
  await fs.ensureDir(outputPath);
  await fs.copy(buildPath + "/main.js", outputPath + "/main.js");
  await fs.copy(buildPath + "/preload.js", outputPath + "/preload.js");
  await fs.copy(distPath, outputPath + "/renderer");
  console.log("✅ Deployed to binary-repo/app");
}

deploy();
