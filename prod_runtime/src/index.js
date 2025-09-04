const path = require("node:path");

console.log("Mod Companion Production Runtime");

console.log("Dirname", __dirname);

const appRoot = path.join(__dirname, "..", "..", "..", "..");
const appModule = path.join(appRoot, "app");

console.log("App root", appRoot);
console.log("App module", appModule);

process.chdir(appRoot);

require(appModule);
