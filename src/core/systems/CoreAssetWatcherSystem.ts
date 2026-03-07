import chokidar, { FSWatcher } from "chokidar";
import { ConversionAgentSystem } from "./conversion/CoreConversionAgentSystem.js";
import { ConfigSystem } from "./CoreConfigSystem.js";
import { Logger } from "./CoreLogSystem.js";
import * as Shared from "mod_companion_shared";
import { getAssetFromFile } from "./asset/CoreAssetRepository.js";
import { getContentRelativePath } from "../helpers/CoreSourceFs.js";

const ignoreMap: Map<string, number> = new Map();
let watcher: FSWatcher | undefined = undefined;

export const AssetWatcherSystem = {
    initSystem() {
        return AssetWatcherSystem.startFileWatcher();
    },
    startFileWatcher(): boolean {
        const config = ConfigSystem.getAppConfig();
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
    const relativePath = getContentRelativePath(filePath);
    const asset = getAssetFromFile(relativePath);
    if (!asset) return;

    Logger.info(Shared.Log.Channel.Assets, "Asset files changed", asset.def.displayName, filePath);
    // notifyAssetsUpdated({ asset: [asset] }); // todo
    ConversionAgentSystem.enqueue(asset.def.id);
}
