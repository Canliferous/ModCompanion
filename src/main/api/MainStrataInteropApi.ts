import { ipcMain } from "electron";
import { SharedIpcChannels } from "Shared/SharedIpcChannels.js";
import { IpcHelper } from "./MainApiHelper.js";
import { StrataInteropSystem } from "../systems/MainStrataInteropSystem.js";

export function registerStrataInteropApi(): boolean {
    ipcMain.on(SharedIpcChannels.InteropSendCommand, (event, command: string) => {
        StrataInteropSystem.sendCommand(command);
    });

    return true;
}

export function notifyStrataInteropConnected(): void {
    IpcHelper.send(SharedIpcChannels.InteropConnected);
}

export function notifyStrataInteropDisconnected(): void {
    IpcHelper.send(SharedIpcChannels.InteropDisconnected);
}

export function notifyStrataInteropLog(message: string): void {
    IpcHelper.send(SharedIpcChannels.InteropLog, message);
}
