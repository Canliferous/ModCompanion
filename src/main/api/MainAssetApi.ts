import { ipcMain } from "electron";
import { IpcHelper } from "./MainApiHelper.js";
import * as Core from "mod_companion_core";
import * as Shared from "mod_companion_shared";

export function registerAssetApi(): boolean {
    ipcMain.handle(Shared.Ipc.Channels.AssetForceRescan, () => {
        return Core.AssetRepository.rescan();
    });

    ipcMain.handle(
        Shared.Ipc.Channels.AssetCreate,
        async (event, primaryFile: string, otherFiles: string[]): Promise<Shared.Asset.SharedCreateAssetReport> => {
            const files = [primaryFile, ...otherFiles];
            Core.Logger.info(Shared.Log.Channel.Assets, "Creating asset for files", primaryFile, otherFiles);
            const existingAsset = Core.AssetRepository.getAssetFromFiles(files);
            if (existingAsset) {
                const allAssetFilesSet = new Set([
                    ...(existingAsset.def.gameFiles ?? []),
                    ...(existingAsset.def.contentFiles ?? []),
                ]);
                const filesAlreadyUsed = Array.from(allAssetFilesSet.intersection(new Set(files)));

                Core.Logger.info(
                    Shared.Log.Channel.Assets,
                    "Asset API: Files are already used in asset. Used Files: ",
                    filesAlreadyUsed,
                    existingAsset,
                );
                return {
                    type: Shared.Asset.SharedCreateAssetReportType.ErrorFileAlreadyUsedInAsset,
                    filesAlreadyUsed,
                    asset: existingAsset.def.id,
                };
            }

            try {
                Core.Logger.info(Shared.Log.Channel.Assets, "Asset API: Files not used in any asset 👍");
                const result = await Core.AssetRepository.createAssetsFromFiles(primaryFile, otherFiles);
                if (!result) {
                    return {
                        type: Shared.Asset.SharedCreateAssetReportType.ErrorUnknown,
                    };
                }
                return { type: Shared.Asset.SharedCreateAssetReportType.Success, assets: result };
            } catch {
                return {
                    type: Shared.Asset.SharedCreateAssetReportType.ErrorUnknown,
                };
            }
        },
    );

    ipcMain.handle(
        Shared.Ipc.Channels.AssetCreateEmpty,
        (event, mcaBasePath: string): Promise<Shared.Asset.SharedAsset> => {
            return Core.AssetRepository.createEmptyAsset(mcaBasePath);
        },
    );

    ipcMain.handle(Shared.Ipc.Channels.AssetDelete, (event, assetId: Shared.Asset.AssetId): Promise<boolean> => {
        return Core.AssetRepository.deleteAssetDef(assetId);
    });

    ipcMain.handle(
        Shared.Ipc.Channels.AssetUpdate,
        async (
            event,
            assetId: Shared.Asset.AssetId,
            assetDef: Shared.Asset.SharedAssetDefinition,
        ): Promise<Shared.Asset.SharedAsset | undefined> => {
            const asset = Core.AssetRepository.getAssetFromId(assetId);
            if (!asset || !asset.defFilePath) return;

            return Core.AssetRepository.writeAssetDef(assetDef, asset.defFilePath);
        },
    );

    return true;
}

export function notifyAssetsRescanned(event: Shared.Asset.SharedAssetRescanEvent): void {
    IpcHelper.send(Shared.Ipc.Channels.AssetRescanned, event);
}

export function notifyAssetsAdded(event: Shared.Asset.SharedAssetAddedEvent): void {
    IpcHelper.send(Shared.Ipc.Channels.AssetAdded, event);
}

export function notifyAssetsUpdated(event: Shared.Asset.SharedAssetUpdatedEvent): void {
    IpcHelper.send(Shared.Ipc.Channels.AssetUpdated, event);
}

export function notifyNavigateToAssetId(assetId: string): void {
    IpcHelper.send(Shared.Ipc.Channels.AssetNavigateToId, assetId);
}
