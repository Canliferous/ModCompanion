import { getMainWindow } from "../systems/MainWindowSystem.js";
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

export function registerAssetApi(): boolean {
    ipcMain.on(SharedIpcChannels.AssetForceRescan, (event) => {
        MainAssetRepository.rescan();
    });

    ipcMain.handle(SharedIpcChannels.AssetCreate, async (event, files: string[]): Promise<SharedCreateAssetReport> => {
        console.log("Creating asset for", files);
        const existingAsset = MainAssetRepository.getAssetFromFiles(files);
        if (existingAsset) {
            const allAssetFilesSet = new Set([
                ...(existingAsset.def.gameFiles ?? []),
                ...(existingAsset.def.contentFiles ?? []),
            ]);
            const filesAlreadyUsed = Array.from(allAssetFilesSet.intersection(new Set(files)));

            return {
                type: SharedCreateAssetReportType.ErrorFileAlreadyUsedInAsset,
                filesAlreadyUsed,
                asset: existingAsset.def.id,
            };
        }

        try {
            const result = await MainAssetRepository.createAsset(files);
            if (!result) {
                return {
                    type: SharedCreateAssetReportType.ErrorUnknown,
                };
            }
            return { type: SharedCreateAssetReportType.Success, asset: result };
        } catch (e) {
            return {
                type: SharedCreateAssetReportType.ErrorUnknown,
            };
        }
    });

    ipcMain.handle(
        SharedIpcChannels.AssetUpdateDisplayName,
        async (event, assetId: SharedAssetId, displayName: string): Promise<SharedAsset | undefined> => {
            const asset = MainAssetRepository.getAssetFromId(assetId);
            if (!asset || !asset.defFilePath) return;

            const newAssetDef: SharedAssetDefinition = { ...asset.def, displayName };
            return await MainAssetRepository.writeAssetDef(newAssetDef, asset.defFilePath);
        },
    );

    return true;
}

export function notifyAssetsRescanned(event: SharedAssetRescanEvent): void {
    getMainWindow()?.webContents.send(SharedIpcChannels.AssetRescanned, event);
}

export function notifyAssetsAdded(event: SharedAssetAddedEvent): void {
    getMainWindow()?.webContents.send(SharedIpcChannels.AssetAdded, event);
}

export function notifyAssetsUpdated(event: SharedAssetUpdatedEvent): void {
    getMainWindow()?.webContents.send(SharedIpcChannels.AssetUpdated, event);
}

export function notifyNavigateToAssetHash(assetHash: string): void {
    getMainWindow()?.webContents.send(SharedIpcChannels.AssetNavigateToHash, assetHash);
}
