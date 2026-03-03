import chokidar, { FSWatcher } from "chokidar";
import MainAssetRepository from "~/systems/asset/CoreAssetRepository.js";
import { ConversionAgentSystem } from "./conversion/CoreConversionAgentSystem.js";
import { getAppConfig } from "./CoreConfigSystem.js";
import { Logger } from "./CoreLogSystem.js";
import { SharedLogChannel } from "Shared/SharedLogger.js";
import MainSourceFs from "~/helpers/CoreSourceFs.js";

const ignoreMap: Map<string, number> = new Map<string, number>();
let watcher: FSWatcher | undefined = undefined;

export const AssetWatcherSystem = {
    initSystem() {
        return AssetWatcherSystem.startFileWatcher();
    },
    startFileWatcher(): boolean {
        const config = getAppConfig();
        watcher = chokidar.watch(config.textureSourcePath, { ignoreInitial: true, awaitWriteFinish: true });

        // watcher.on("add", _handleAdded);
        watcher.on("change", _handleChanged);
        // watcher.on("unlink", _handleDeleted);

        return true;
    },
    ignore(filePath: string, ignoreCount = 1) {
        ignoreMap.set(filePath, ignoreCount);
    },
};

function _handleChanged(filePath: string): void {
    const ignoreCount = ignoreMap.get(filePath);
    if (ignoreCount !== undefined && ignoreCount > 0) {
        ignoreMap.set(filePath, ignoreCount - 1);
        return;
    }
    const relativePath = MainSourceFs.getContentRelativePath(filePath);
    const asset = MainAssetRepository.getAssetFromFile(relativePath);
    if (!asset) return;

    Logger.info(SharedLogChannel.Assets, "Asset files changed", asset.def.displayName, filePath);
    // notifyAssetsUpdated({ asset: [asset] }); // todo
    ConversionAgentSystem.enqueue(asset.def.id);
}
