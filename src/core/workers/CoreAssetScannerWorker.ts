import * as Shared from "mod_companion_shared";
import * as pathe from "pathe";
import fs from "node:fs/promises";
import * as sourcelib from "sourcelib";
import { useWorkerThreadData } from "../helpers/CoreWorkerHelper.js";
import { parentPort } from "worker_threads";

const data = useWorkerThreadData<typeof Shared.Workers.WorkerFile.AssetScanner>();

_buildAssets(data.args.index).then((result) => parentPort?.postMessage(result));

async function _buildAssets(
    index: Map<string, Shared.FileBrowser.FileEntry[]>,
): Promise<Map<Shared.Asset.AssetId, Shared.Asset.Asset>> {
    const assets = new Map<Shared.Asset.AssetId, Shared.Asset.Asset>();

    for (const filePaths of index.values()) {
        for (const filePath of filePaths) {
            if (!filePath.path.startsWith("content")) continue;

            let definition: Shared.Asset.AssetDef | undefined;
            let isTransient = false;

            if (Shared.Asset.isMcaFile(filePath.path)) {
                definition = await _readMcaFile(filePath.path, data.common.appConfig.rootPath);
            } else if (Shared.Asset.isQcFile(filePath.path)) {
                definition = await _readQcFile(filePath.path, data.common.appConfig.rootPath);
                isTransient = true;
            } else {
                continue;
            }

            if (definition === undefined) {
                // Logger.warning(Shared.Log.Channel.Assets, "Asset", filePath, "is invalid and will be ignored");
                continue;
            }

            const duplicateOther = assets.get(definition.id);
            if (duplicateOther !== undefined) {
                // Logger.warning(
                //     Shared.Log.Channel.Assets,
                //     "Asset definition file",
                //     filePath,
                //     "has the same id as",
                //     duplicateOther.def.id,
                //     definition.id,
                //     "and will be ignored",
                // );
                continue;
            }

            const asset: Shared.Asset.Asset = {
                def: definition,
                defFilePath: Shared.SourceFs.forwardSlashed(filePath.path),
                isTransient,
            };
            assets.set(definition.id, asset);
        }
    }

    return assets;
}

async function _readMcaFile(fileName: string, fileRootPath: string): Promise<Shared.Asset.AssetDef | undefined> {
    const fullPath = pathe.join(fileRootPath, fileName);
    const text = await fs.readFile(fullPath, "utf-8");
    const unk = JSON.parse(text);

    if (unk.type === undefined) {
        // Logger.warning(Shared.Log.Channel.Assets, "Asset definition file", fileName, "has no type");
        return undefined;
    }
    if (unk.id === undefined) {
        // Logger.warning(Shared.Log.Channel.Assets, "Asset definition file", fileName, "has no id");
        return undefined;
    }
    if (!Shared.Asset.isValidAssetType(unk.type)) {
        // Logger.warning(Shared.Log.Channel.Assets, "Asset definition file", fileName, "has invalid type ", unk.type);
        return undefined;
    }

    return unk;
}

async function _readQcFile(fileName: string, fileRootPath: string): Promise<Shared.Asset.AssetDef | undefined> {
    const fullQcPath = pathe.join(fileRootPath, fileName);
    const text = await fs.readFile(fullQcPath, "utf-8");
    const qcDoc = sourcelib.qc.QcParser.parseText(text);
    const refs = sourcelib.qc.QcUtils.getAllReferencedModelInputFiles(qcDoc);

    const def = Shared.AssetModel.createModelAssetDefinition(data.common.appConfig, fullQcPath, refs);
    // TODO: Check if content files exist
    return def;
}
