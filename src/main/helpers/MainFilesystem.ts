import path from "node:path";
import { fileURLToPath } from "node:url";

export function getMainAssetsDir() {
    const dirname = path.dirname(fileURLToPath(import.meta.url));
    return path.resolve(path.join(dirname, "../../main_assets/"));
}

export function getRendererDir() {
    const dirname = path.dirname(fileURLToPath(import.meta.url));
    return path.resolve(path.join(dirname, "../../renderer/"));
}

export function getRootDir() {
    const dirname = path.dirname(fileURLToPath(import.meta.url));
    return path.resolve(path.join(dirname, "../../"));
}
