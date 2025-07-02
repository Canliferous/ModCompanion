import { getMainWindow } from "../systems/MainWindowSystem.js";
import { SharedIpcChannels } from "Shared/SharedIpcChannels.js";
import { SharedConversionUpdateEvent } from "Shared/SharedConversion.js";
import { ipcMain } from "electron";
import { enqueue, startConversionAgent, stopConversionAgent } from "../systems/MainConversionAgentSystem.js";
import { SharedAssetId } from "Shared/SharedAssetDefinition.js";

export function registerConversionApi(): boolean {
    ipcMain.on(SharedIpcChannels.ConversionAgentStart, (event) => {
        startConversionAgent();
    });
    ipcMain.on(SharedIpcChannels.ConversionAgentStop, (event) => {
        stopConversionAgent();
    });
    ipcMain.on(SharedIpcChannels.ConversionEnqueue, (event, assetId: SharedAssetId) => {
        enqueue(assetId);
    });
    return true;
}

export function notifyConversionsUpdated(event: SharedConversionUpdateEvent): void {
    getMainWindow()?.webContents.send(SharedIpcChannels.ConversionUpdated, event);
}
