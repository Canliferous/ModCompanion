import * as pathe from "pathe";
import { fileURLToPath } from "node:url";

export function isEsm(): boolean {
    return typeof module === "undefined";
}

export function getRootDir() {
    const dirname = pathe.dirname(fileURLToPath(import.meta.url));
    const back = isEsm() ? "../../" : "../";
    return pathe.resolve(pathe.join(dirname, back));
}

export function getMainAssetsDir() {
    return pathe.join(getRootDir(), "main_assets");
}

export function getRendererDir() {
    return pathe.join(getRootDir(), "renderer");
}
