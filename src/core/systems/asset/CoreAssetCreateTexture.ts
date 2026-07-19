import { filename } from "pathe/utils";
import * as pathe from "pathe";
import { AssetRepositorySystem } from "./CoreAssetRepositorySystem.js";
import { getContentRelativePath } from "../../helpers/CoreSourceFs.js";
import * as Shared from "mod_companion_shared";

function _disassembleTextureName(contentFile: string): { sub: string; name: string } {
    const materialsrc = "materialsrc";
    const start = contentFile.indexOf(materialsrc) + materialsrc.length + 1;
    const sub = contentFile.substring(start);
    const name = filename(sub) ?? pathe.basename(sub);

    return { sub, name };
}

export function deriveTextureGameFileName(contentFile: string): string {
    const { sub, name } = _disassembleTextureName(contentFile);
    const stripped = pathe.join("materials", pathe.dirname(sub), name) + ".vtf";
    return Shared.SourceFs.forwardSlashed(stripped);
}

export function deriveTextureDisplayName(contentFile: string): string {
    const { sub, name } = _disassembleTextureName(contentFile);
    const stripped = pathe.join(pathe.dirname(sub), name);
    return Shared.SourceFs.forwardSlashed(stripped);
}

export function createTextureAssetDefinition(file: string): Shared.Asset.TextureAssetDef {
    const id = AssetRepositorySystem.generateAssetId();
    const contentFile = getContentRelativePath(file);
    const assetDef: Shared.Asset.TextureAssetDef = {
        type: Shared.Asset.Types.Texture,
        id: id,
        contentFiles: [contentFile],
        gameFiles: [deriveTextureGameFileName(contentFile)],
        displayName: deriveTextureDisplayName(contentFile),
    };

    return assetDef;
}
