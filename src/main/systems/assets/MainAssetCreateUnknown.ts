import { SharedAssetDefinition, SharedAssetTypes } from "Shared/SharedAssetDefinition.js";
import { getContentRelativePath, getGameRelativePath } from "../../helpers/MainSourceFs.js";
import { generateAssetId } from "./MainAssetRepository.js";

export function createUnknownAssetDefinition(primaryFile: string, otherFiles: string[]): SharedAssetDefinition {
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

    const id = generateAssetId();
    const assetDef: SharedAssetDefinition = {
        type: SharedAssetTypes.Unknown,
        id: id,
        contentFiles,
        gameFiles,
        displayName: `New Asset (${fileCount} file${fileCount !== 1 ? "s" : ""})`,
    };

    return assetDef;
}
