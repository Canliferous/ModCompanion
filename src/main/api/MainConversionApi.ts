import { SharedIpcChannels } from "Shared/SharedIpcChannels.js";
import { SharedConversionGetStateIpcReport, SharedConversionUpdateIpcEvent } from "Shared/SharedConversion.js";
import { ipcMain } from "electron";
import { ConversionAgentSystem } from "../systems/MainConversionAgentSystem.js";
import { SharedAssetId } from "Shared/SharedAssetDefinition.js";
import { ConversionEventSystem } from "../systems/MainConversionEventSystem.js";
import { IpcHelper } from "./MainApiHelper.js";

export function registerConversionApi(): boolean {
    ipcMain.on(SharedIpcChannels.ConversionAgentStart, () => {
        ConversionAgentSystem.startAgent();
    });
    ipcMain.on(SharedIpcChannels.ConversionAgentStop, () => {
        ConversionAgentSystem.stopAgent();
    });
    ipcMain.on(SharedIpcChannels.ConversionEnqueue, (event, assetId: SharedAssetId) => {
        ConversionAgentSystem.enqueue(assetId, true);
    });
    ipcMain.handle(SharedIpcChannels.ConversionGetState, async (): Promise<SharedConversionGetStateIpcReport> => {
        return { conversions: ConversionAgentSystem.getConversionsMap() };
    });
    ipcMain.on(SharedIpcChannels.ConversionClearEvents, () => {
        ConversionEventSystem.clearEvents();
    });
    return true;
}

export function notifyConversionsUpdated(event: SharedConversionUpdateIpcEvent): void {
    IpcHelper.send(SharedIpcChannels.ConversionUpdated, event);
}
