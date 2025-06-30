import { FSWatcher } from "chokidar";
import { getConfig } from "../MainConfigSystem.js";

let watcher: FSWatcher | undefined = undefined;
export function startFileWatcher(): boolean {
    const config = getConfig();
    // watcher = chokidar.watch(config.contentPath);
    // watcher.add(config.gamePath);
    //
    // watcher.on("add", _handleAdded);
    // watcher.on("change", _handleChanged);
    // watcher.on("unlink", _handleDeleted);

    return true;
}
//
// function _handleAdded(filePath: string): void {
//     let isContent = MainSourceFs.isContentFile(filePath);
//     const type = isContent ? _getContentAssetType(filePath) : _getGameAssetType(filePath);
//
//     if (type == SharedAssetType.Unknown) return;
//
//     const relativePath = isContent
//         ? MainSourceFs.getContentRelativePath(filePath)
//         : MainSourceFs.getGameRelativePath(filePath);
//     const { asset, created } = MainAssetRepository.addFile(relativePath.toLowerCase(), type, isContent);
//
//     if (created) {
//         console.log("File watcher: Asset added", asset.displayName);
//         notifyAssetsAdded({ assets: [asset] });
//     } else {
//         console.log("File watcher: Asset new files added", asset.displayName);
//         notifyAssetsUpdated({ assets: [asset] });
//     }
// }
//
// function _getContentAssetType(filePath: string): SharedAssetType {
//     if (MainAssetTextureScanner.isContentTexture(filePath)) {
//         return SharedAssetType.Texture;
//     }
//
//     return SharedAssetType.Unknown;
// }
//
// function _getGameAssetType(filePath: string): SharedAssetType {
//     if (MainAssetTextureScanner.isGameTexture(filePath)) {
//         return SharedAssetType.Texture;
//     }
//
//     return SharedAssetType.Unknown;
// }
//
// function _handleChanged(filePath: string): void {
//     const hash = MainAssetRepository.getAssetFromFile(filePath);
//     if (!hash) return;
//
//     const asset = MainAssetRepository.getAssetFromHash(hash);
//     if (!asset) return;
//
//     console.log("File watcher: Asset files changed", asset.displayName, filePath);
//     notifyAssetsUpdated({ assets: [asset] });
// }
// function _handleDeleted(filePath: string): void {
//     const result = MainAssetRepository.removeFile(filePath);
//     if (result) {
//         console.log("File watcher: File removed", filePath);
//         notifyAssetsUpdated({ assets: [result.asset] });
//     }
// }
//
// export default {
//     startFileWatcher,
// };
