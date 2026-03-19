import { getContentRelativePath, getGameRelativePath } from "../../helpers/CoreSourceFs.js";
import { AssetRepositorySystem } from "./CoreAssetRepositorySystem.js";
import * as Shared from "mod_companion_shared";

export function createUnknownAssetDefinition(primaryFile: string, otherFiles: string[]): Shared.Asset.AssetDef {
    const files = [primaryFile, ...otherFiles];
    const contentFiles: string[] = [];
    const gameFiles: string[] = [];
    for (const file of files) {
        if (file.startsWith("content")) {
            contentFiles.push(getContentRelativePath(file));
        }
        if (file.startsWith("game")) {
            gameFiles.push(getGameRelativePath(file));
        }
    }

    const fileCount = contentFiles.length + gameFiles.length;

    const id = AssetRepositorySystem.generateAssetId();
    const assetDef: Shared.Asset.AssetDef = {
        type: Shared.Asset.Types.Unknown,
        id: id,
        contentFiles,
        gameFiles,
        displayName: `New Asset (${fileCount} file${fileCount !== 1 ? "s" : ""})`,
    };

    return assetDef;
}
