import { ipcMain } from "electron";
import { IpcHelper } from "./MainApiHelper.js";
import * as Core from "mod_companion_core";
import * as Shared from "mod_companion_shared";
import { GameInteropSystem } from "mod_companion_core";

export function registerGameInteropApi(): boolean {
    ipcMain.on(Shared.Ipc.Channels.InteropSendCommand, (event, command: string) => {
        Core.GameInteropSystem.sendCommand(command);
    });

    return true;
}

export function notifyGameInteropConnected(): void {
    IpcHelper.send(Shared.Ipc.Channels.InteropConnected);
}

export function notifyGameInteropDisconnected(): void {
    IpcHelper.send(Shared.Ipc.Channels.InteropDisconnected);
}

export function notifyGameInteropLog(message: string): void {
    IpcHelper.send(Shared.Ipc.Channels.InteropLog, message);
}
