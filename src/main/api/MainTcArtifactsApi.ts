import { ipcMain } from "electron";
import { SharedIpcChannels } from "Shared/SharedIpcChannels.js";
import { SharedTcArtifactsListAllMapsReport } from "Shared/SharedTcArtifacts.js";
import { TcArtifactsSystem } from "../systems/MainTcArtifactsSystem.js";

export function registerTcArtifactsApi(): boolean {
    ipcMain.handle(SharedIpcChannels.TcArtifacts_IsConnected, (event): Promise<boolean> => {
        return TcArtifactsSystem.isCloudConnected();
    });
    ipcMain.handle(SharedIpcChannels.TcArtifacts_ListAllMaps, (event): SharedTcArtifactsListAllMapsReport => {
        return {
            maps: {},
        };
    });

    return true;
}
