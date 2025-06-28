import { getMainWindow } from "../systems/MainWindowSystem.js";
import { SharedIpcChannels } from "Shared/SharedIpcChannels.js";
import { SharedConversionUpdateEvent } from "Shared/SharedConversion.js";
import { ipcMain } from "electron";
import { startConversionAgent, stopConversionAgent } from "../systems/MainConversionAgentSystem.js";

export function registerConversionApi(): boolean {
    ipcMain.on(SharedIpcChannels.ConversionAgentStart, (event) => {
        startConversionAgent();
    });
    ipcMain.on(SharedIpcChannels.ConversionAgentStop, (event) => {
        stopConversionAgent();
    });
    return true;
}

export function notifyConversionsUpdated(event: SharedConversionUpdateEvent): void {
    getMainWindow()?.webContents.send(SharedIpcChannels.ConversionUpdated, event);
}
