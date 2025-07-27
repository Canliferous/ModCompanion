import {
    SharedAsset,
    SharedAssetDefinition,
    SharedAssetDefinitionFileExtension,
    SharedAssetId,
    SharedAssetMap,
    SharedAssetType,
} from "Shared/SharedAssetDefinition.js";
import { notifyAssetsRescanned } from "../../api/MainAssetApi.js";
import { buildAssets } from "./MainAssetScanner.js";
import { scanContentTree } from "../files/MainFileScanner.js";
import { v4 } from "uuid";
import { getGameOrContentRelativePath } from "../../helpers/MainSourceFs.js";
import path from "path";
import fs from "fs/promises";
import { getConfig } from "../MainConfigSystem.js";

let assetMap: SharedAssetMap = new Map<SharedAssetId, SharedAsset>();

export function getAssetMap(): Readonly<SharedAssetMap> {
    return assetMap;
}

export async function rescan() {
    console.log("Rescanning assets...");

    const startMillis = new Date().getTime();
    const contentTree = await scanContentTree();
    const endMillis = new Date().getTime();

    assetMap = await buildAssets(contentTree);

    notifyAssetsRescanned({ assets: assetMap, totalTimeMillis: endMillis - startMillis });
}

// TODO: Collision check?
export function generateAssetId(): string {
    return v4();
}

export async function createAsset(files: string[]): Promise<SharedAsset | undefined> {
    if (files.length === 0) return undefined;

    if (files.length === 1) {
        const file = files[0];
        const isContent = file.startsWith("content");
        const relativeFile = getGameOrContentRelativePath(file);
        console.log(file, relativeFile);
        const id = generateAssetId();
        const assetDef: SharedAssetDefinition = {
            type: SharedAssetType.Unknown, // TODO: Determine type
            id: id,
            contentFiles: isContent ? [relativeFile] : undefined,
            gameFiles: !isContent ? [relativeFile] : undefined,
            associatedFiles: undefined,
            displayName: file,
        };

        const mcaPath = file + SharedAssetDefinitionFileExtension;
        const newAsset = await writeAssetDef(assetDef, mcaPath);
        assetMap.set(id, newAsset);
        return newAsset;
    }

    return undefined;
}

export async function writeAssetDef(assetDef: SharedAssetDefinition, mcaPath: string): Promise<SharedAsset> {
    const absoluteMcaPath = path.join(getConfig().rootPath, mcaPath);
    const payload = JSON.stringify(assetDef, undefined, 2);
    await fs.writeFile(absoluteMcaPath, payload);
    return { defFilePath: mcaPath, def: assetDef };
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
    createAsset,
    getAssetFromId,
    writeAssetDef,
};
