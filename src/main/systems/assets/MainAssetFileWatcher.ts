import chokidar, { FSWatcher } from "chokidar";
import { getConfig } from "../MainConfigSystem.js";
import MainAssetTextureScanner from "./MainAssetTextureScanner.js";
import MainAssetRepository from "./MainAssetRepository.js";
import { SharedAssetType } from "../../../shared/SharedAsset.js";
import path from "path";

let watcher: FSWatcher | undefined = undefined;
export function startFileWatcher(): boolean {
    const config = getConfig();
    watcher = chokidar.watch(config.contentPath);

    watcher.on("add", _handleAdded);
    watcher.on("change", _handleChanged);
    watcher.on("unlink", _handleDeleted);

    return true;
}

// TODO: Move away
function _getContentRelativePath(filePath: string): string {
    const config = getConfig();
    const contentPath = path.join(config.contentPath, config.gameName);
    if (filePath.toLowerCase().startsWith(contentPath.toLowerCase())) {
        return filePath.substring(contentPath.length);
    }

    return filePath;
}

function _handleAdded(filePath: string): void {
    if (MainAssetTextureScanner.isContentTextureSource(filePath)) {
        const relativePath = _getContentRelativePath(filePath);
        MainAssetRepository.addContentFileToAsset(
            MainAssetRepository.getAssetMap(),
            relativePath.toLowerCase(),
            SharedAssetType.Texture,
        );
    }
}
function _handleChanged(filePath: string): void {}
function _handleDeleted(filePath: string): void {}

export default {
    startFileWatcher,
};
