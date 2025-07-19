import chokidar, { FSWatcher } from "chokidar";
import { getConfig } from "../MainConfigSystem.js";
import { SharedAssetType } from "Shared/SharedAssetDefinition.js";
import MainAssetRepository from "./MainAssetRepository.js";
import { notifyAssetsUpdated } from "../../api/MainAssetApi.js";
import { enqueue } from "../MainConversionAgentSystem.js";
import MainSourceFs from "../../helpers/MainSourceFs.js";

let watcher: FSWatcher | undefined = undefined;
export function startFileWatcher(): boolean {
    const config = getConfig();
    watcher = chokidar.watch(config.textureSourcePath, { ignoreInitial: true });

    watcher.on("add", _handleAdded);
    watcher.on("change", _handleChanged);
    watcher.on("unlink", _handleDeleted);

    return true;
}

function _handleAdded(filePath: string): void {}

function _handleChanged(filePath: string): void {
    const relativePath = MainSourceFs.getContentRelativePath(filePath);
    console.log(relativePath);
    const asset = MainAssetRepository.getAssetFromFile(relativePath);
    if (!asset) return;

    console.log("File watcher: Asset files changed", asset.def.displayName, filePath);
    notifyAssetsUpdated({ assets: [asset] });
    enqueue(asset.def.id);
}

function _handleDeleted(filePath: string): void {}

export default {
    startFileWatcher,
};
