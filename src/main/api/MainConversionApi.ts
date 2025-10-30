import { getMainWindow } from "../systems/MainWindowSystem.js";
import { SharedIpcChannels } from "Shared/SharedIpcChannels.js";
import {
    SharedConversionGetStateReport,
    SharedConversionSummaryEvent,
    SharedConversionUpdateEvent,
} from "Shared/SharedConversion.js";
import { ipcMain } from "electron";
import {
    enqueueConversion,
    getConversionState,
    startConversionAgent,
    stopConversionAgent,
} from "../systems/MainConversionAgentSystem.js";
import { SharedAssetId } from "Shared/SharedAssetDefinition.js";

export function registerConversionApi(): boolean {
    ipcMain.on(SharedIpcChannels.ConversionAgentStart, (event) => {
        startConversionAgent();
    });
    ipcMain.on(SharedIpcChannels.ConversionAgentStop, (event) => {
        stopConversionAgent();
    });
    ipcMain.on(SharedIpcChannels.ConversionEnqueue, (event, assetId: SharedAssetId) => {
        enqueueConversion(assetId, true);
    });
    ipcMain.handle(SharedIpcChannels.ConversionGetState, async (event): Promise<SharedConversionGetStateReport> => {
        return { conversions: getConversionState() };
    });
    return true;
}

export function notifyConversionsUpdated(event: SharedConversionUpdateEvent): void {
    getMainWindow()?.webContents.send(SharedIpcChannels.ConversionUpdated, event);
}
export function notifyConversionSummary(event: SharedConversionSummaryEvent): void {
    getMainWindow()?.webContents.send(SharedIpcChannels.ConversionSummary, event);
}
