import { clipboard, ipcMain } from "electron";
import { SharedIpcChannels } from "Shared/SharedIpcChannels.js";

export function registerClipboardApi(): boolean {
    ipcMain.on(SharedIpcChannels.ClipboardWriteText, (event, text: string, type?: "selection" | "clipboard") => {
        clipboard.writeText(text, type);
    });

    return true;
}
