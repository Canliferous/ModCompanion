import {
    SharedAsset,
    SharedAssetDefinition,
    SharedAssetDefinitionFileExtension,
    SharedAssetId,
    SharedAssetMap,
} from "Shared/SharedAssetDefinition.js";
import { notifyAssetsRescanned } from "../../api/MainAssetApi.js";
import { buildAssets } from "./MainAssetScanner.js";
import { scanContentTree } from "../files/MainFileScanner.js";
import { v4 } from "uuid";
import path from "path";
import fs from "fs/promises";
import { getAppConfig } from "../MainConfigSystem.js";
import { AssetCreationInferResults, inferAssetCreationType } from "./MainAssetCreateInferType.js";
import { createUnknownAssetDefinition } from "./MainAssetCreateUnknown.js";
import { createTextureAssetDefinition } from "./MainAssetCreateTexture.js";
import { detectPotentialAssets } from "./MainAssetAutoDetect.js";
import { maintainAssets } from "./MainAssetMaintenance.js";
import { ConversionChecksumSystem } from "../MainConversionChecksumSystem.js";
import { ConversionAgentSystem } from "../MainConversionAgentSystem.js";

let assetMap: SharedAssetMap = new Map<SharedAssetId, SharedAsset>();
let potentialAssets: SharedAsset[] = [];

export function getAssetMap(): Readonly<SharedAssetMap> {
    return assetMap;
}

export async function rescan() {
    console.log("Rescanning assets...");

    const startMillis = new Date().getTime();

    const contentTree = await scanContentTree();
    assetMap = await buildAssets(contentTree);
    await maintainAssets(assetMap);
    potentialAssets = detectPotentialAssets(contentTree);
    await ConversionChecksumSystem.initChecksums(assetMap);
    await ConversionAgentSystem.initStates(assetMap);

    const endMillis = new Date().getTime();

    notifyAssetsRescanned({ assets: assetMap, potentialAssets, totalTimeMillis: endMillis - startMillis });
}

// TODO: Collision check?
export function generateAssetId(): string {
    return v4();
}

export async function createAssetsFromFiles(
    primaryFile: string,
    otherFiles: string[],
): Promise<SharedAsset[] | undefined> {
    const files = [primaryFile, ...otherFiles];
    if (files.length === 0) return undefined;

    const inferredType = inferAssetCreationType(files);

    console.log("Inferred asset type", inferredType);
    if (inferredType === AssetCreationInferResults.Unknown) {
        const def = createUnknownAssetDefinition(primaryFile, otherFiles);
        const mca = primaryFile + SharedAssetDefinitionFileExtension;

        const newAsset = await writeAssetDef(def, mca);
        assetMap.set(def.id, newAsset);
        return [newAsset];
    }

    if (inferredType === AssetCreationInferResults.Texture) {
        const newAssets: SharedAsset[] = [];
        for (const file of files) {
            const def = createTextureAssetDefinition(file);
            const mca = file + SharedAssetDefinitionFileExtension;

            const newAsset = await writeAssetDef(def, mca);
            assetMap.set(def.id, newAsset);
            newAssets.push(newAsset);
        }
        return newAssets;
    }

    return undefined;
}

export async function writeAssetDef(assetDef: SharedAssetDefinition, mcaPath: string): Promise<SharedAsset> {
    const absoluteMcaPath = path.join(getAppConfig().rootPath, mcaPath);
    const payload = JSON.stringify(assetDef, undefined, 2);
    console.log("Writing asset", mcaPath, assetDef);
    await fs.writeFile(absoluteMcaPath, payload);

    const asset = { defFilePath: mcaPath, def: assetDef };
    assetMap.set(assetDef.id, asset);
    return asset;
}

export function getAssetFromFile(filePath: string): SharedAsset | undefined {
    for (let asset of assetMap.values()) {
        if (asset.def.gameFiles?.includes(filePath)) return asset;
        if (asset.def.contentFiles?.includes(filePath)) return asset;
        if (asset.defFilePath === filePath) return asset;
    }

    return undefined;
}

export function getAssetFromFiles(filePaths: string[]): SharedAsset | undefined {
    for (let asset of assetMap.values()) {
        for (const filePath of filePaths) {
            if (asset.def.gameFiles?.includes(filePath)) return asset;
            if (asset.def.contentFiles?.includes(filePath)) return asset;
        }
    }

    return undefined;
}

export function getAssetFromId(hash: SharedAssetId): SharedAsset | undefined {
    return assetMap.get(hash);
}

export default {
    rescan,
    getAssetFromFile,
    getAssetFromFiles,
    createAssetsFromFiles,
    getAssetFromId,
    writeAssetDef,
};
