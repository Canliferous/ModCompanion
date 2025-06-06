// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { Launchers } from "./shared/Launchers.js";
import { IpcChannels } from "./shared/IpcChannels.js";

import { contextBridge, ipcRenderer, IpcRendererEvent } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
    app: {
        exit: () => ipcRenderer.send(IpcChannels.AppExit),
        launch: (launcherType: Launchers, launcherArgs: string) =>
            ipcRenderer.send(IpcChannels.AppLaunch, launcherType, launcherArgs),
    },

    config: {
        get: () => ipcRenderer.invoke(IpcChannels.ConfigGet),
    },

    map: {
        listSourceDirs: () => ipcRenderer.invoke(IpcChannels.MapListSourceDirs),
        enqueue: (mapPath: string) => ipcRenderer.send(IpcChannels.MapEnqueue, mapPath),
        subscribeQueueUpdated: (callback: (maps: string[]) => void) =>
            ipcRenderer.on(IpcChannels.MapQueueUpdated, (e: IpcRendererEvent, maps: string[]) => callback(maps)),
        subscribeCompileLog: (callback: (log: string) => void) =>
            ipcRenderer.on(IpcChannels.MapCompileLog, (e: IpcRendererEvent, log: string) => callback(log)),
        // unsubscribeMapQueueUpdated: (callback) => ipcRenderer.off("map_queue_updated", (e, v) => callback(v)),
    },
});
