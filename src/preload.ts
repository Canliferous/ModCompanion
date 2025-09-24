// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { SharedLaunchers } from "./shared/SharedLaunchers.js";
import { SharedIpcChannels } from "./shared/SharedIpcChannels.js";

import { contextBridge, ipcRenderer, IpcRendererEvent, webUtils, clipboard as electronClipboard } from "electron";
import { SharedMapCompileLogEvent } from "./shared/SharedMapCompileLogEvent.js";
import { SharedMapCompileProgressEvent } from "./shared/SharedMapCompileProgressEvent.js";
import { SharedMapPath } from "./shared/SharedMapPath.js";
import { SharedMapTimeReport } from "./shared/SharedMapTimeReport.js";
import {
    SharedAssetAddedEvent,
    SharedAssetDefinition,
    SharedAssetId,
    SharedAssetRescanEvent,
    SharedAssetUpdatedEvent,
} from "./shared/SharedAssetDefinition.js";
import { SharedConversionUpdateEvent } from "./shared/SharedConversion";
import { SharedAssetGroupDefinition, SharedAssetGroupId, SharedAssetGroupRescanEvent } from "./shared/SharedAssetGroup";

contextBridge.exposeInMainWorld("electronAPI", {
    app: {
        exit: () => ipcRenderer.send(SharedIpcChannels.AppExit),
        launch: (launcherType: SharedLaunchers, launcherArgs: string) =>
            ipcRenderer.send(SharedIpcChannels.AppLaunch, launcherType, launcherArgs),
        browseToFile: (filePath: string) => ipcRenderer.send(SharedIpcChannels.AppBrowseToFile, filePath),
        openFile: (filePath: string) => ipcRenderer.send(SharedIpcChannels.AppOpenFile, filePath),
    },

    project: {
        listFiles: (dirPath: string) => ipcRenderer.invoke(SharedIpcChannels.ProjectListFiles, dirPath),
        correctPath: (dirPath: string) => ipcRenderer.invoke(SharedIpcChannels.ProjectCorrectPath, dirPath),
        launchFile: (filePath: string | string[]) => ipcRenderer.send(SharedIpcChannels.ProjectLaunchFile, filePath),
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
        createAsset: (primaryFile: string, otherFiles: string[]) =>
            ipcRenderer.invoke(SharedIpcChannels.AssetCreate, primaryFile, otherFiles),
        update: (assetId: SharedAssetId, assetDef: SharedAssetDefinition) =>
            ipcRenderer.invoke(SharedIpcChannels.AssetUpdate, assetId, assetDef),
    },

    assetGroups: {
        forceRescan: () => ipcRenderer.send(SharedIpcChannels.AssetGroupsForceRescan),
        subscribeRescanned: (callback: (event: SharedAssetGroupRescanEvent) => void) =>
            ipcRenderer.on(
                SharedIpcChannels.AssetGroupsRescanned,
                (e: IpcRendererEvent, event: SharedAssetGroupRescanEvent) => callback(event),
            ),
        create: (assetGroupDef: SharedAssetGroupDefinition) =>
            ipcRenderer.invoke(SharedIpcChannels.AssetGroupsCreate, assetGroupDef),
        update: (groupId: SharedAssetGroupId, groupDef: SharedAssetGroupDefinition) =>
            ipcRenderer.invoke(SharedIpcChannels.AssetGroupsUpdate, groupId, groupDef),
        delete: (groupId: SharedAssetGroupId) => ipcRenderer.send(SharedIpcChannels.AssetGroupsDelete, groupId),
    },

    image: {
        getMeta: (imageFilePath: string) => ipcRenderer.invoke(SharedIpcChannels.ImageGetMeta, imageFilePath),
    },

    conversion: {
        enqueue: (assetId: SharedAssetId) => ipcRenderer.send(SharedIpcChannels.ConversionEnqueue, assetId),
        startAgent: () => ipcRenderer.send(SharedIpcChannels.ConversionAgentStart),
        stopAgent: () => ipcRenderer.send(SharedIpcChannels.ConversionAgentStop),
        subscribeUpdated: (callback: (event: SharedConversionUpdateEvent) => void) =>
            ipcRenderer.on(
                SharedIpcChannels.ConversionUpdated,
                (e: IpcRendererEvent, event: SharedConversionUpdateEvent) => callback(event),
            ),
        getState: () => ipcRenderer.invoke(SharedIpcChannels.ConversionGetState),
    },

    hotReload: {
        setEnabled: (enable: boolean) => ipcRenderer.send(SharedIpcChannels.HotReloadSetEnabled, enable),
    },

    webUtils: {
        getPathForFile: (file: File) => webUtils.getPathForFile(file),
    },

    clipboard: {
        writeText: (text: string, type?: "selection" | "clipboard") =>
            ipcRenderer.send(SharedIpcChannels.ClipboardWriteText, text, type),
    },
});
