// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { SharedLaunchers } from "./shared/SharedLaunchers.js";
import { SharedIpcChannels } from "./shared/SharedIpcChannels.js";

import { contextBridge, ipcRenderer, IpcRendererEvent } from "electron";
import { SharedMapCompileLogEvent } from "./shared/SharedMapCompileLogEvent.js";
import { SharedMapCompileProgressEvent } from "./shared/SharedMapCompileProgressEvent.js";
import { SharedMapPath } from "./shared/SharedMapPath.js";
import { SharedMapTimeReport } from "./shared/SharedMapTimeReport.js";
import {
    SharedAsset,
    SharedAssetAddedEvent,
    SharedAssetRescanEvent,
    SharedAssetUpdatedEvent,
} from "./shared/SharedAsset.js";
import { SharedImageMetaReport } from "./shared/SharedImageMetaReport";

contextBridge.exposeInMainWorld("electronAPI", {
    app: {
        exit: () => ipcRenderer.send(SharedIpcChannels.AppExit),
        launch: (launcherType: SharedLaunchers, launcherArgs: string) =>
            ipcRenderer.send(SharedIpcChannels.AppLaunch, launcherType, launcherArgs),
        browseToFile: (filePath: string) => ipcRenderer.send(SharedIpcChannels.AppBrowseToFile, filePath),
        openFile: (filePath: string) => ipcRenderer.send(SharedIpcChannels.AppOpenFile, filePath),
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

    asset: {
        forceRescan: () => ipcRenderer.send(SharedIpcChannels.AssetForceRescan),
        subscribeRescanned: (callback: (event: SharedAssetRescanEvent) => void) =>
            ipcRenderer.on(SharedIpcChannels.AssetRescanned, (e: IpcRendererEvent, event: SharedAssetRescanEvent) =>
                callback(event),
            ),
        subscribeAdded: (callback: (event: SharedAssetAddedEvent) => void) =>
            ipcRenderer.on(SharedIpcChannels.AssetAdded, (e: IpcRendererEvent, event: SharedAssetAddedEvent) =>
                callback(event),
            ),
        subscribeUpdated: (callback: (event: SharedAssetUpdatedEvent) => void) =>
            ipcRenderer.on(SharedIpcChannels.AssetUpdated, (e: IpcRendererEvent, event: SharedAssetUpdatedEvent) =>
                callback(event),
            ),
        subscribeNavigateToHash: (callback: (assetHash: string) => void) =>
            ipcRenderer.on(SharedIpcChannels.AssetNavigateToHash, (e: IpcRendererEvent, assetHash: string) =>
                callback(assetHash),
            ),
    },

    image: {
        getMeta: (imageFilePath: string) => ipcRenderer.invoke(SharedIpcChannels.ImageGetMeta, imageFilePath),
    },
});
