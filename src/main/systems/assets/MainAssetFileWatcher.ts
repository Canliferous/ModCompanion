import chokidar, { FSWatcher } from "chokidar";
import { getConfig } from "../MainConfigSystem.js";
import MainAssetTextureScanner from "./MainAssetTextureScanner.js";
import MainAssetRepository from "./MainAssetRepository.js";
import { SharedAsset, SharedAssetHash, SharedAssetType } from "../../../shared/SharedAsset.js";
import { notifyAssetsAdded, notifyAssetsUpdated } from "../../api/MainAssetApi.js";
import MainSourceFs from "../../helpers/MainSourceFs.js";

let watcher: FSWatcher | undefined = undefined;
export function startFileWatcher(): boolean {
    const config = getConfig();
    watcher = chokidar.watch(config.contentPath);
    watcher.add(config.gamePath);

    watcher.on("add", _handleAdded);
    watcher.on("change", _handleChanged);
    watcher.on("unlink", _handleDeleted);

    return true;
}

function _handleAdded(filePath: string): void {
    let isContent = MainSourceFs.isContentFile(filePath);
    const type = isContent ? _getContentAssetType(filePath) : _getGameAssetType(filePath);

    if (type == SharedAssetType.Unknown) return;

    const relativePath = isContent
        ? MainSourceFs.getContentRelativePath(filePath)
        : MainSourceFs.getGameRelativePath(filePath);
    const { asset, created } = MainAssetRepository.addFile(relativePath.toLowerCase(), type, isContent);

    if (created) {
        notifyAssetsAdded({ assets: [asset] });
    } else {
        notifyAssetsUpdated({ assets: [asset] });
    }
}

function _getContentAssetType(filePath: string): SharedAssetType {
    if (MainAssetTextureScanner.isContentTexture(filePath)) {
        return SharedAssetType.Texture;
    }

    return SharedAssetType.Unknown;
}

function _getGameAssetType(filePath: string): SharedAssetType {
    if (MainAssetTextureScanner.isGameTexture(filePath)) {
        return SharedAssetType.Texture;
    }

    return SharedAssetType.Unknown;
}

function _handleChanged(filePath: string): void {
    const hash = MainAssetRepository.getAssetFromFile(filePath);
    if (!hash) return;

    const asset = MainAssetRepository.getAssetFromHash(hash);
    if (!asset) return;

    notifyAssetsUpdated({ assets: [asset] });
}
function _handleDeleted(filePath: string): void {
    const result = MainAssetRepository.removeFile(filePath);
    if (result) {
        notifyAssetsUpdated({ assets: [result.asset] });
    }
}

export default {
    startFileWatcher,
};
