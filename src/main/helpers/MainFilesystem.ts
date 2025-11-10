import path from "node:path";
import { fileURLToPath } from "node:url";

export function isEsm(): boolean {
    return typeof module === "undefined";
}

export function getRootDir() {
    const dirname = path.dirname(fileURLToPath(import.meta.url));
    const back = isEsm() ? "../../" : "../";
    return path.resolve(path.join(dirname, back));
}

export function getMainAssetsDir() {
    return path.join(getRootDir(), "main_assets");
}

export function getRendererDir() {
    return path.join(getRootDir(), "renderer");
}
