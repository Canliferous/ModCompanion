import { SharedAssetTypes, SharedTextureAssetDefinition } from "Shared/SharedAssetDefinition.js";
import { generateAssetId } from "./MainAssetRepository.js";
import { filename } from "pathe/utils";
import path from "path";
import { forwardSlashed } from "Shared/SharedSourceFs.js";
import { getContentRelativePath } from "../../helpers/MainSourceFs.js";

function _disassembleTextureName(contentFile: string): { sub: string; name: string } {
    const materialsrc = "materialsrc";
    const start = contentFile.indexOf(materialsrc) + materialsrc.length + 1;
    const sub = contentFile.substring(start);
    const name = filename(sub) ?? path.basename(sub);

    return { sub, name };
}

export function deriveTextureGameFileName(contentFile: string): string {
    const { sub, name } = _disassembleTextureName(contentFile);
    const stripped = path.join("materials", path.dirname(sub), name) + ".vtf";
    return forwardSlashed(stripped);
}

export function deriveTextureDisplayName(contentFile: string): string {
    const { sub, name } = _disassembleTextureName(contentFile);
    const stripped = path.join(path.dirname(sub), name);
    return forwardSlashed(stripped);
}

export function createTextureAssetDefinition(file: string): SharedTextureAssetDefinition {
    const id = generateAssetId();
    const contentFile = getContentRelativePath(file);
    const assetDef: SharedTextureAssetDefinition = {
        type: SharedAssetTypes.Texture,
        id: id,
        contentFiles: [contentFile],
        gameFiles: [deriveTextureGameFileName(contentFile)],
        displayName: deriveTextureDisplayName(contentFile),
    };

    return assetDef;
}
