// import { notifyAssetsRescanned } from "../../../main/api/MainAssetApi.js";
import { buildAssets } from "./CoreAssetScanner.js";
import { scanContentTree } from "../../helpers/CoreFileScanner.js";
import { v4 } from "uuid";
import path from "path";
import fs from "fs/promises";
import { ConfigSystem } from "../CoreConfigSystem.js";
import { AssetCreationInferResults, inferAssetCreationType } from "./CoreAssetCreateInferType.js";
import { createUnknownAssetDefinition } from "./CoreAssetCreateUnknown.js";
import { createTextureAssetDefinition } from "./CoreAssetCreateTexture.js";
import { detectPotentialAssets } from "./CoreAssetAutoDetect.js";
import { maintainAssets } from "./CoreAssetMaintenance.js";
import { ConversionChecksumSystem } from "../conversion/CoreConversionChecksumSystem.js";
import { ConversionAgentSystem } from "../conversion/CoreConversionAgentSystem.js";
import { existsSync } from "fs";
import { Logger } from "../CoreLogSystem.js";
import * as Shared from "mod_companion_shared";

let assetMap: Shared.Asset.SharedAssetMap = new Map();
let potentialAssets: Shared.Asset.SharedAsset[] = [];

export function getAssetMap(): Readonly<Shared.Asset.SharedAssetMap> {
    return assetMap;
}

export async function rescan(): Promise<Shared.Asset.SharedAssetRescanEvent> {
    Logger.info(Shared.Log.Channel.Generic, "Rescanning asset...");

    const startMillis = new Date().getTime();

    const contentTree = await scanContentTree();
    assetMap = await buildAssets(contentTree);
    await maintainAssets(assetMap);
    potentialAssets = detectPotentialAssets(contentTree);
    await ConversionChecksumSystem.initChecksums(assetMap);
    await ConversionAgentSystem.initStates(assetMap);

    const endMillis = new Date().getTime();

    return { assets: assetMap, potentialAssets, totalTimeMillis: endMillis - startMillis };
}

// TODO: Collision check?
export function generateAssetId(): string {
    return v4();
}

export async function createAssetsFromFiles(
    primaryFile: string,
    otherFiles: string[],
): Promise<Shared.Asset.SharedAsset[] | undefined> {
    const files = [primaryFile, ...otherFiles];
    if (files.length === 0) return undefined;

    const inferredType = inferAssetCreationType(files);

    Logger.info(Shared.Log.Channel.Generic, "Inferred asset type", inferredType);
    if (inferredType === AssetCreationInferResults.Unknown) {
        const def = createUnknownAssetDefinition(primaryFile, otherFiles);
        const mca = primaryFile + Shared.Asset.McaFileExt;

        const newAsset = await writeAssetDef(def, mca);
        assetMap.set(def.id, newAsset);
        return [newAsset];
    }

    if (inferredType === AssetCreationInferResults.Texture) {
        const newAssets: Shared.Asset.SharedAsset[] = [];
        for (const file of files) {
            const def = createTextureAssetDefinition(file);
            const mca = file + Shared.Asset.McaFileExt;

            const newAsset = await writeAssetDef(def, mca);
            assetMap.set(def.id, newAsset);
            newAssets.push(newAsset);
        }
        return newAssets;
    }

    return undefined;
}

export function createEmptyAsset(mcaBasePath: string): Promise<Shared.Asset.SharedAsset> {
    let mcaFilePath = "";
    let mcaFileName = "";

    Logger.debug(Shared.Log.Channel.Generic, mcaBasePath);

    let i = 0;
    do {
        mcaFileName = `new_asset_${i++}`;
        mcaFilePath = path.join(mcaBasePath, `${mcaFileName}.mca`);
    } while (existsSync(path.join(ConfigSystem.getAppConfig().rootPath, mcaFilePath)));

    return writeAssetDef(
        {
            id: generateAssetId(),
            displayName: mcaFileName,
            type: Shared.Asset.Types.Unknown,
        },
        mcaFilePath,
    );
}

export async function writeAssetDef(
    assetDef: Shared.Asset.SharedAssetDefinition,
    mcaPath: string,
): Promise<Shared.Asset.SharedAsset> {
    const absoluteMcaPath = path.join(ConfigSystem.getAppConfig().rootPath, mcaPath);
    const payload = JSON.stringify(assetDef, undefined, 2);
    Logger.info(Shared.Log.Channel.Generic, "Writing asset", mcaPath, assetDef);
    await fs.writeFile(absoluteMcaPath, payload);

    const asset = { defFilePath: mcaPath, def: assetDef };
    assetMap.set(assetDef.id, asset);
    return asset;
}

export function getAssetFromFile(filePath: string): Shared.Asset.SharedAsset | undefined {
    for (const asset of assetMap.values()) {
        if (asset.def.gameFiles?.includes(filePath)) return asset;
        if (asset.def.contentFiles?.includes(filePath)) return asset;
        if (asset.defFilePath === filePath) return asset;
    }

    return undefined;
}

export function getAssetFromFiles(filePaths: string[]): Shared.Asset.SharedAsset | undefined {
    for (const asset of assetMap.values()) {
        for (const filePath of filePaths) {
            if (asset.def.gameFiles?.includes(filePath)) return asset;
            if (asset.def.contentFiles?.includes(filePath)) return asset;
        }
    }

    return undefined;
}

export function getAssetFromId(hash: Shared.Asset.AssetId): Shared.Asset.SharedAsset | undefined {
    return assetMap.get(hash);
}

export async function deleteAssetDef(assetId: Shared.Asset.AssetId): Promise<boolean> {
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
        Logger.warning(Shared.Log.Channel.Generic, "Failed to delete asset", assetId, e);
        return false;
    }
}
