import chokidar, { FSWatcher } from "chokidar";
import { getConfig } from "../MainConfigSystem.js";
import MainAssetTextureScanner from "./MainAssetTextureScanner.js";
import MainAssetRepository from "./MainAssetRepository.js";
import { SharedAssetType } from "../../../shared/SharedAsset.js";
import { notifyAssetsAdded } from "../../api/MainAssetApi.js";
import MainSourceFs from "../../helpers/MainSourceFs.js";

let watcher: FSWatcher | undefined = undefined;
export function startFileWatcher(): boolean {
    const config = getConfig();
    watcher = chokidar.watch(config.contentPath);

    watcher.on("add", _handleAdded);
    watcher.on("change", _handleChanged);
    watcher.on("unlink", _handleDeleted);

    return true;
}

function _handleAdded(filePath: string): void {
    if (MainAssetTextureScanner.isContentTextureSource(filePath)) {
        const relativePath = MainSourceFs.getContentRelativePath(filePath);
        const { asset, created } = MainAssetRepository.addContentFile(
            relativePath.toLowerCase(),
            SharedAssetType.Texture,
        );
        if (created) {
            notifyAssetsAdded({ assets: [asset] });
        }
    }
}
function _handleChanged(filePath: string): void {}
function _handleDeleted(filePath: string): void {}

export default {
    startFileWatcher,
};
