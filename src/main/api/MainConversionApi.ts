import { SharedIpcChannels } from "Shared/SharedIpcChannels.js";
import { SharedConversionGetStateIpcReport, SharedConversionUpdateIpcEvent } from "Shared/SharedConversion.js";
import { ipcMain } from "electron";
import { ConversionAgentSystem } from "../systems/MainConversionSystems.js";
import { SharedAssetId } from "Shared/SharedAssetDefinition.js";
import { ConversionEventSystem } from "../systems/ConversionEventSystem.js";
import { IpcHelper } from "./MainApiHelper.js";

export function registerConversionApi(): boolean {
    ipcMain.on(SharedIpcChannels.ConversionAgentStart, (event) => {
        ConversionAgentSystem.startAgent();
    });
    ipcMain.on(SharedIpcChannels.ConversionAgentStop, (event) => {
        ConversionAgentSystem.stopAgent();
    });
    ipcMain.on(SharedIpcChannels.ConversionEnqueue, (event, assetId: SharedAssetId) => {
        ConversionAgentSystem.enqueue(assetId, true);
    });
    ipcMain.handle(SharedIpcChannels.ConversionGetState, async (event): Promise<SharedConversionGetStateIpcReport> => {
        return { conversions: ConversionAgentSystem.getConversionsMap() };
    });
    ipcMain.on(SharedIpcChannels.ConversionClearEvents, (event) => {
        ConversionEventSystem.clearEvents();
    });
    return true;
}

export function notifyConversionsUpdated(event: SharedConversionUpdateIpcEvent): void {
    IpcHelper.send(SharedIpcChannels.ConversionUpdated, event);
}
