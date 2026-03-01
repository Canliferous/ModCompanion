import { clipboard, ipcMain } from "electron";
import { SharedIpcChannels } from "Shared/SharedIpcChannels.js";

export function registerChamberSignConfigApi(): boolean {
    ipcMain.on(SharedIpcChannels.TcArtifacts_IsConnected, (event, text: string, type?: "selection" | "clipboard") => {
        clipboard.writeText(text, type);
    });

    return true;
}
