import { clipboard, ipcMain } from "electron";
import * as Shared from "mod_companion_shared";

export function registerClipboardApi(): boolean {
    ipcMain.on(Shared.Ipc.Channels.ClipboardWriteText, (event, text: string, type?: "selection" | "clipboard") => {
        clipboard.writeText(text, type);
    });

    return true;
}
