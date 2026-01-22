import { SharedIpcChannels } from "Shared/SharedIpcChannels.js";
import { ipcMain } from "electron";
import MainAssetRepository from "../systems/assets/MainAssetRepository.js";
import {
    SharedAsset,
    SharedAssetAddedEvent,
    SharedAssetDefinition,
    SharedAssetId,
    SharedAssetRescanEvent,
    SharedAssetUpdatedEvent,
} from "Shared/SharedAssetDefinition.js";
import { SharedCreateAssetReport, SharedCreateAssetReportType } from "Shared/SharedCreateAssetReport.js";
import { IpcHelper } from "./MainApiHelper.js";

export function registerAssetApi(): boolean {
    ipcMain.on(SharedIpcChannels.AssetForceRescan, () => {
        MainAssetRepository.rescan();
    });

    ipcMain.handle(
        SharedIpcChannels.AssetCreate,
        async (event, primaryFile: string, otherFiles: string[]): Promise<SharedCreateAssetReport> => {
            const files = [primaryFile, ...otherFiles];
            console.log("Asset API: Creating asset for files", primaryFile, otherFiles);
            const existingAsset = MainAssetRepository.getAssetFromFiles(files);
            if (existingAsset) {
                const allAssetFilesSet = new Set([
                    ...(existingAsset.def.gameFiles ?? []),
                    ...(existingAsset.def.contentFiles ?? []),
                ]);
                const filesAlreadyUsed = Array.from(allAssetFilesSet.intersection(new Set(files)));

                console.debug(
                    "Asset API: Files are already used in asset. Used Files: ",
                    filesAlreadyUsed,
                    existingAsset,
                );
                return {
                    type: SharedCreateAssetReportType.ErrorFileAlreadyUsedInAsset,
                    filesAlreadyUsed,
                    asset: existingAsset.def.id,
                };
            }

            try {
                console.debug("Asset API: Files not used in any assets 👍");
                const result = await MainAssetRepository.createAssetsFromFiles(primaryFile, otherFiles);
                if (!result) {
                    return {
                        type: SharedCreateAssetReportType.ErrorUnknown,
                    };
                }
                return { type: SharedCreateAssetReportType.Success, assets: result };
            } catch {
                return {
                    type: SharedCreateAssetReportType.ErrorUnknown,
                };
            }
        },
    );

    ipcMain.handle(SharedIpcChannels.AssetCreateEmpty, (event, mcaBasePath: string): Promise<SharedAsset> => {
        return MainAssetRepository.createEmptyAsset(mcaBasePath);
    });

    ipcMain.handle(SharedIpcChannels.AssetDelete, (event, assetId: SharedAssetId): Promise<boolean> => {
        return MainAssetRepository.deleteAssetDef(assetId);
    });

    ipcMain.handle(
        SharedIpcChannels.AssetUpdate,
        async (event, assetId: SharedAssetId, assetDef: SharedAssetDefinition): Promise<SharedAsset | undefined> => {
            const asset = MainAssetRepository.getAssetFromId(assetId);
            if (!asset || !asset.defFilePath) return;

            return MainAssetRepository.writeAssetDef(assetDef, asset.defFilePath);
        },
    );

    return true;
}

export function notifyAssetsRescanned(event: SharedAssetRescanEvent): void {
    IpcHelper.send(SharedIpcChannels.AssetRescanned, event);
}

export function notifyAssetsAdded(event: SharedAssetAddedEvent): void {
    IpcHelper.send(SharedIpcChannels.AssetAdded, event);
}

export function notifyAssetsUpdated(event: SharedAssetUpdatedEvent): void {
    IpcHelper.send(SharedIpcChannels.AssetUpdated, event);
}

export function notifyNavigateToAssetId(assetId: string): void {
    IpcHelper.send(SharedIpcChannels.AssetNavigateToId, assetId);
}
