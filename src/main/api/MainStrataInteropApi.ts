import { ipcMain } from "electron";
import { SharedIpcChannels } from "Shared/SharedIpcChannels.js";
import { getMainWindow } from "../systems/MainWindowSystem.js";
import { sendStrataCommand } from "../systems/MainStrataInteropSystem.js";

export function registerStrataInteropApi(): boolean {
    ipcMain.on(SharedIpcChannels.InteropSendCommand, (event, command: string) => {
        sendStrataCommand(command);
    });

    return true;
}

export function notifyStrataInteropConnected(): void {
    getMainWindow()?.webContents.send(SharedIpcChannels.InteropConnected);
}

export function notifyStrataInteropDisconnected(): void {
    getMainWindow()?.webContents.send(SharedIpcChannels.InteropDisconnected);
}
