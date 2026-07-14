import { ipcMain } from "electron";
import * as Shared from "mod_companion_shared";
import * as Core from "mod_companion_core";

export const VtfApi = {
    register(): boolean {
        ipcMain.handle(
            Shared.Ipc.Channels.VtfInfoQuery,
            (event: Electron.IpcMainInvokeEvent, absFilePath: string): Promise<Shared.Vtf.SharedVtfInfo> => {
                return Core.MareTfSystem.getVtfInfo(absFilePath);
            },
        );

        ipcMain.handle(
            Shared.Ipc.Channels.VtfExtractQuery,
            (event: Electron.IpcMainInvokeEvent, absFilePath: string): Promise<string> => {
                return Core.MareTfSystem.getVtfExtract(absFilePath);
            },
        );

        return true;
    },
};
