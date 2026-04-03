import { AssetRepositorySystem } from "./CoreAssetRepositorySystem.js";
import path from "path";
import { getContentRelativePath, getGameRelativePath } from "../../helpers/CoreSourceFs.js";
import * as Shared from "mod_companion_shared";

export function createModelAssetDefinition(
    primaryFile: string,
    otherFiles: string[],
): { qcFile: string | undefined; def: Shared.Asset.ModelAssetDef } {
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

    const qcFile = files.find((f) => path.extname(f) === ".qc");
    const displayName = qcFile?.replace(".qc", "") ?? "Unknown Model";

    const id = AssetRepositorySystem.generateAssetId();
    const def: Shared.Asset.ModelAssetDef = {
        type: Shared.Asset.Types.Model,
        id: id,
        contentFiles,
        gameFiles,
        displayName,
    };

    return { qcFile, def };
}
