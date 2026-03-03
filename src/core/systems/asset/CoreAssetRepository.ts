import {
    SharedAsset,
    SharedAssetDefinition,
    SharedAssetDefinitionFileExtension,
    SharedAssetId,
    SharedAssetMap,
    SharedAssetTypes,
} from "Shared/SharedAssetDefinition.js";
// import { notifyAssetsRescanned } from "../../../main/api/MainAssetApi.js";
import { buildAssets } from "./CoreAssetScanner.js";
import { scanContentTree } from "../files/CoreFileScanner.js";
import { v4 } from "uuid";
import path from "path";
import fs from "fs/promises";
import { getAppConfig } from "~/systems/CoreConfigSystem.js";
import { AssetCreationInferResults, inferAssetCreationType } from "./CoreAssetCreateInferType.js";
import { createUnknownAssetDefinition } from "./CoreAssetCreateUnknown.js";
import { createTextureAssetDefinition } from "./CoreAssetCreateTexture.js";
import { detectPotentialAssets } from "./CoreAssetAutoDetect.js";
import { maintainAssets } from "./CoreAssetMaintenance.js";
import { ConversionChecksumSystem } from "../conversion/CoreConversionChecksumSystem.js";
import { ConversionAgentSystem } from "../conversion/CoreConversionAgentSystem.js";
import { existsSync } from "fs";
import { Logger } from "../CoreLogSystem.js";
import { SharedLogChannel } from "Shared/SharedLogger.js";

let assetMap: SharedAssetMap = new Map<SharedAssetId, SharedAsset>();
let potentialAssets: SharedAsset[] = [];

export function getAssetMap(): Readonly<SharedAssetMap> {
    return assetMap;
}

export async function rescan() {
    Logger.info(SharedLogChannel.Generic, "Rescanning asset...");

    const startMillis = new Date().getTime();

    const contentTree = await scanContentTree();
    assetMap = await buildAssets(contentTree);
    await maintainAssets(assetMap);
    potentialAssets = detectPotentialAssets(contentTree);
    await ConversionChecksumSystem.initChecksums(assetMap);
    await ConversionAgentSystem.initStates(assetMap);

    const endMillis = new Date().getTime();

    // notifyAssetsRescanned({ asset: assetMap, potentialAssets, totalTimeMillis: endMillis - startMillis }); //todo
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

    Logger.info(SharedLogChannel.Generic, "Inferred asset type", inferredType);
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

export function createEmptyAsset(mcaBasePath: string): Promise<SharedAsset> {
    let mcaFilePath = "";
    let mcaFileName = "";

    Logger.debug(SharedLogChannel.Generic, mcaBasePath);

    let i = 0;
    do {
        mcaFileName = `new_asset_${i++}`;
        mcaFilePath = path.join(mcaBasePath, `${mcaFileName}.mca`);
    } while (existsSync(path.join(getAppConfig().rootPath, mcaFilePath)));

    return writeAssetDef(
        {
            id: generateAssetId(),
            displayName: mcaFileName,
            type: SharedAssetTypes.Unknown,
        },
        mcaFilePath,
    );
}

export async function writeAssetDef(assetDef: SharedAssetDefinition, mcaPath: string): Promise<SharedAsset> {
    const absoluteMcaPath = path.join(getAppConfig().rootPath, mcaPath);
    const payload = JSON.stringify(assetDef, undefined, 2);
    Logger.info(SharedLogChannel.Generic, "Writing asset", mcaPath, assetDef);
    await fs.writeFile(absoluteMcaPath, payload);

    const asset = { defFilePath: mcaPath, def: assetDef };
    assetMap.set(assetDef.id, asset);
    return asset;
}

export function getAssetFromFile(filePath: string): SharedAsset | undefined {
    for (const asset of assetMap.values()) {
        if (asset.def.gameFiles?.includes(filePath)) return asset;
        if (asset.def.contentFiles?.includes(filePath)) return asset;
        if (asset.defFilePath === filePath) return asset;
    }

    return undefined;
}

export function getAssetFromFiles(filePaths: string[]): SharedAsset | undefined {
    for (const asset of assetMap.values()) {
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

export async function deleteAssetDef(assetId: SharedAssetId) {
    const asset = assetMap.get(assetId);
    if (!asset) return false;

    if (!asset.defFilePath) return false;

    const exists = existsSync(asset.defFilePath);
    if (!exists) return false;

    const stat = await fs.stat(asset.defFilePath);
    if (!stat.isFile()) return false;

    try {
        await fs.rm(asset.defFilePath);
        return true;
    } catch (e) {
        Logger.warning(SharedLogChannel.Generic, "Failed to delete asset", assetId, e);
        return false;
    }
}

export default {
    rescan,
    getAssetFromFile,
    getAssetFromFiles,
    createAssetsFromFiles,
    createEmptyAsset,
    getAssetFromId,
    writeAssetDef,
    deleteAssetDef,
};
