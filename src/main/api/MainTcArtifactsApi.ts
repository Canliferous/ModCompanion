import { ipcMain } from "electron";

import * as Core from "mod_companion_core";
import * as Shared from "mod_companion_shared";

export function registerTcArtifactsApi(): boolean {
    ipcMain.handle(Shared.Ipc.Channels.TcArtifacts_IsConnected, (): Promise<boolean> => {
        return Core.TcArtifactsSystem.isCloudConnected();
    });
    ipcMain.handle(
        Shared.Ipc.Channels.TcArtifacts_ListAllMaps,
        (): Promise<Shared.TcArtifacts.SharedTcArtifactsListAllMapsReport | undefined> => {
            return Core.TcArtifactsSystem.listMaps();
        },
    );
    ipcMain.handle(
        Shared.Ipc.Channels.TcArtifacts_DownloadMap,
        async (e, artifactKey: string, mapPath: string): Promise<boolean> => {
            return await Core.TcArtifactsSystem.downloadMap(artifactKey, mapPath);
        },
    );

    return true;
}
