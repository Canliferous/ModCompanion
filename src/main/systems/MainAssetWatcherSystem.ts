import chokidar, { FSWatcher } from "chokidar";
import MainSourceFs from "../helpers/MainSourceFs.js";
import MainAssetRepository from "./assets/MainAssetRepository.js";
import { notifyAssetsUpdated } from "../api/MainAssetApi.js";
import { ConversionAgentSystem } from "./MainConversionAgentSystem.js";
import { getAppConfig } from "./MainConfigSystem.js";

const ignoreMap: Map<string, number> = new Map<string, number>();
let watcher: FSWatcher | undefined = undefined;

export const AssetWatcherSystem = {
    initSystem() {
        return AssetWatcherSystem.startFileWatcher();
    },
    startFileWatcher(): boolean {
        const config = getAppConfig();
        watcher = chokidar.watch(config.textureSourcePath, { ignoreInitial: true, awaitWriteFinish: true });

        watcher.on("add", _handleAdded);
        watcher.on("change", _handleChanged);
        watcher.on("unlink", _handleDeleted);

        return true;
    },
    ignore(filePath: string, ignoreCount = 1) {
        ignoreMap.set(filePath, ignoreCount);
    },
};

function _handleAdded(filePath: string): void {}

function _handleChanged(filePath: string): void {
    const ignoreCount = ignoreMap.get(filePath);
    if (ignoreCount !== undefined && ignoreCount > 0) {
        ignoreMap.set(filePath, ignoreCount - 1);
        return;
    }
    const relativePath = MainSourceFs.getContentRelativePath(filePath);
    const asset = MainAssetRepository.getAssetFromFile(relativePath);
    if (!asset) return;

    console.log("File watcher: Asset files changed", asset.def.displayName, filePath);
    notifyAssetsUpdated({ assets: [asset] });
    ConversionAgentSystem.enqueue(asset.def.id);
}

function _handleDeleted(filePath: string): void {}
