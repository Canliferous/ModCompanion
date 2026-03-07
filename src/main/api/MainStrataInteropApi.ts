import { ipcMain } from "electron";
import { IpcHelper } from "./MainApiHelper.js";
import * as Core from "mod_companion_core";
import * as Shared from "mod_companion_shared";

export function registerStrataInteropApi(): boolean {
    ipcMain.on(Shared.Ipc.Channels.InteropSendCommand, (event, command: string) => {
        Core.StrataInteropSystem.sendCommand(command);
    });

    return true;
}

export function notifyStrataInteropConnected(): void {
    IpcHelper.send(Shared.Ipc.Channels.InteropConnected);
}

export function notifyStrataInteropDisconnected(): void {
    IpcHelper.send(Shared.Ipc.Channels.InteropDisconnected);
}

export function notifyStrataInteropLog(message: string): void {
    IpcHelper.send(Shared.Ipc.Channels.InteropLog, message);
}
