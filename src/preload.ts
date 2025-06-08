// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { SharedLaunchers } from "./shared/SharedLaunchers.js";
import { SharedIpcChannels } from "./shared/SharedIpcChannels.js";

import { contextBridge, ipcRenderer, IpcRendererEvent } from "electron";
import { SharedMapCompileLogEvent } from "./shared/SharedMapCompileLogEvent.js";
import { SharedMapCompileProgressEvent } from "./shared/SharedMapCompileProgressEvent.js";
import { SharedMapPath } from "./shared/SharedMapPath.js";
import { SharedMapTimeReport } from "./shared/SharedMapTimeReport.js";

contextBridge.exposeInMainWorld("electronAPI", {
    app: {
        exit: () => ipcRenderer.send(SharedIpcChannels.AppExit),
        launch: (launcherType: SharedLaunchers, launcherArgs: string) =>
            ipcRenderer.send(SharedIpcChannels.AppLaunch, launcherType, launcherArgs),
    },

    config: {
        get: () => ipcRenderer.invoke(SharedIpcChannels.ConfigGet),
    },

    map: {
        listSourceDirs: () => ipcRenderer.invoke(SharedIpcChannels.MapListSourceDirs),
        enqueue: (mapPath: string) => ipcRenderer.send(SharedIpcChannels.MapEnqueue, mapPath),
        subscribeQueueUpdated: (callback: (maps: string[]) => void) =>
            ipcRenderer.on(SharedIpcChannels.MapQueueUpdated, (e: IpcRendererEvent, maps: string[]) => callback(maps)),
        subscribeCompileLog: (callback: (event: SharedMapCompileLogEvent) => void) =>
            ipcRenderer.on(SharedIpcChannels.MapCompileLog, (e: IpcRendererEvent, event: SharedMapCompileLogEvent) =>
                callback(event),
            ),
        subscribeCompileProgress: (callback: (event: SharedMapCompileProgressEvent) => void) =>
            ipcRenderer.on(
                SharedIpcChannels.MapCompileProgress,
                (e: IpcRendererEvent, event: SharedMapCompileProgressEvent) => callback(event),
            ),
        createTimeReport: (maps: SharedMapPath[]) =>
            ipcRenderer.invoke(SharedIpcChannels.MapCreateTimeReport, maps) as Promise<SharedMapTimeReport>,
    },
});
