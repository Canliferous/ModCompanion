import { ipcMain } from "electron";
import { IpcHelper } from "./MainApiHelper.js";

import * as Core from "mod_companion_core";
import * as Shared from "mod_companion_shared";

export function registerConversionApi(): boolean {
    ipcMain.on(Shared.Ipc.Channels.ConversionAgentStart, () => {
        Core.ConversionAgentSystem.startAgent();
    });
    ipcMain.on(Shared.Ipc.Channels.ConversionAgentStop, () => {
        Core.ConversionAgentSystem.stopAgent();
    });
    ipcMain.on(Shared.Ipc.Channels.ConversionEnqueue, (event, assetId: Shared.Asset.AssetId) => {
        Core.ConversionAgentSystem.enqueue(assetId, true);
    });
    ipcMain.on(Shared.Ipc.Channels.ConversionEnqueueAll, () => {
        Core.ConversionAgentSystem.enqueueAll();
    });
    ipcMain.handle(
        Shared.Ipc.Channels.ConversionGetState,
        async (): Promise<Shared.Conversion.SharedConversionGetStateIpcReport> => {
            return { conversions: Core.ConversionAgentSystem.getConversionsMap() };
        },
    );
    ipcMain.on(Shared.Ipc.Channels.ConversionClearEvents, () => {
        Core.ConversionEventSystem.clearEvents();
    });
    return true;
}

export function notifyConversionsUpdated(event: Shared.Conversion.UpdateEvent): void {
    IpcHelper.send(Shared.Ipc.Channels.ConversionUpdated, event);
}
