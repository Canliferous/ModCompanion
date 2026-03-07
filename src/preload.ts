// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { SharedLaunchers } from "./shared/SharedLaunchers.js";
import { Channels } from "./shared/Shared.Ipc.Channels.js";

import { contextBridge, ipcRenderer, IpcRendererEvent, webUtils } from "electron";
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
import { SharedConversionUpdateIpcEvent } from "./shared/SharedConversion";
import { SharedAssetGroupDefinition, SharedAssetGroupId, SharedAssetGroupRescanEvent } from "./shared/SharedAssetGroup";
import { SharedFileBrowserDirectoryUpdatedReport } from "./shared/SharedFileListing";
import { LogType } from "vite";
import { SharedLogEvent } from "./shared/SharedLogger";
import { Stream } from "node:stream";

contextBridge.exposeInMainWorld("electronAPI", {
    app: {
        exit: () => ipcRenderer.send(Channels.AppExit),
        launch: (launcherType: SharedLaunchers, launcherArgs: string) =>
            ipcRenderer.send(Channels.AppLaunch, launcherType, launcherArgs),
    },

    fileBrowser: {
        listFiles: (dirPath: string) => ipcRenderer.invoke(Channels.FileBrowserListFiles, dirPath),
        correctPath: (dirPath: string) => ipcRenderer.invoke(Channels.FileBrowserCorrectPath, dirPath),
        launchFile: (filePath: string | string[]) => ipcRenderer.send(Channels.FileBrowserLaunchFile, filePath),
        setCurrentPath: (dirPath: string) => ipcRenderer.send(Channels.FileBrowserSetCurrentPath, dirPath),
        browseToFile: (filePath: string) => ipcRenderer.send(Channels.FileBrowserBrowseToFile, filePath),
        openFile: (filePath: string) => ipcRenderer.send(Channels.FileBrowserOpenFile, filePath),
        subscribeDirectoryChanged: (callback: (event: SharedFileBrowserDirectoryUpdatedReport) => void) =>
            ipcRenderer.on(
                Channels.FileBrowserCurrentDirUpdated,
                (e: IpcRendererEvent, event: SharedFileBrowserDirectoryUpdatedReport) => callback(event),
            ),
    },

    file: {
        readString: (filePath: string) => ipcRenderer.invoke(Channels.FileReadString, filePath),
        writeString: (
            filePath: string,
            data:
                | string
                | NodeJS.ArrayBufferView
                | Iterable<string | NodeJS.ArrayBufferView>
                | AsyncIterable<string | NodeJS.ArrayBufferView>
                | Stream,
        ) => ipcRenderer.invoke(Channels.FileWriteString, filePath, data),
    },

    config: {
        get: () => ipcRenderer.invoke(Channels.ConfigGet),
    },

    map: {
        listSourceDirs: () => ipcRenderer.invoke(Channels.MapListSourceDirs),
        enqueue: (mapPaths: string[]) => ipcRenderer.send(Channels.MapQueueEnqueue, mapPaths),
        subscribeQueueUpdated: (callback: (maps: string[]) => void) =>
            ipcRenderer.on(Channels.MapQueueUpdated, (e: IpcRendererEvent, maps: string[]) => callback(maps)),
        cancelQueue: () => ipcRenderer.send(Channels.MapQueueCancel),
        pauseQueue: (paused: boolean) => ipcRenderer.send(Channels.MapQueueSetPaused, paused),
        subscribeCompileLog: (callback: (event: SharedMapCompileLogEvent) => void) =>
            ipcRenderer.on(Channels.MapCompileLog, (e: IpcRendererEvent, event: SharedMapCompileLogEvent) =>
                callback(event),
            ),
        subscribeCompileProgress: (callback: (event: SharedMapCompileProgressEvent) => void) =>
            ipcRenderer.on(Channels.MapCompileProgress, (e: IpcRendererEvent, event: SharedMapCompileProgressEvent) =>
                callback(event),
            ),
        createTimeReport: (maps: SharedMapPath[]) =>
            ipcRenderer.invoke(Channels.MapCreateTimeReport, maps) as Promise<SharedMapTimeReport>,
    },

    asset: {
        forceRescan: () => ipcRenderer.send(Channels.AssetForceRescan),
        subscribeRescanned: (callback: (event: SharedAssetRescanEvent) => void) =>
            ipcRenderer.on(Channels.AssetRescanned, (e: IpcRendererEvent, event: SharedAssetRescanEvent) =>
                callback(event),
            ),
        subscribeAdded: (callback: (event: SharedAssetAddedEvent) => void) =>
            ipcRenderer.on(Channels.AssetAdded, (e: IpcRendererEvent, event: SharedAssetAddedEvent) => callback(event)),
        subscribeUpdated: (callback: (event: SharedAssetUpdatedEvent) => void) =>
            ipcRenderer.on(Channels.AssetUpdated, (e: IpcRendererEvent, event: SharedAssetUpdatedEvent) =>
                callback(event),
            ),
        subscribeNavigateToHash: (callback: (assetHash: string) => void) =>
            ipcRenderer.on(Channels.AssetNavigateToId, (e: IpcRendererEvent, assetHash: string) => callback(assetHash)),
        createAsset: (primaryFile: string, otherFiles: string[]) =>
            ipcRenderer.invoke(Channels.AssetCreate, primaryFile, otherFiles),
        createEmpty: (mcaFilePath: string) => ipcRenderer.invoke(Channels.AssetCreateEmpty, mcaFilePath),
        update: (assetId: SharedAssetId, assetDef: SharedAssetDefinition) =>
            ipcRenderer.invoke(Channels.AssetUpdate, assetId, assetDef),
        delete: (assetId: SharedAssetId) => ipcRenderer.invoke(Channels.AssetDelete, assetId),
    },

    assetGroups: {
        forceRescan: () => ipcRenderer.send(Channels.AssetGroupsForceRescan),
        subscribeRescanned: (callback: (event: SharedAssetGroupRescanEvent) => void) =>
            ipcRenderer.on(Channels.AssetGroupsRescanned, (e: IpcRendererEvent, event: SharedAssetGroupRescanEvent) =>
                callback(event),
            ),
        create: (assetGroupDef: SharedAssetGroupDefinition) =>
            ipcRenderer.invoke(Channels.AssetGroupsCreate, assetGroupDef),
        update: (groupId: SharedAssetGroupId, groupDef: SharedAssetGroupDefinition) =>
            ipcRenderer.invoke(Channels.AssetGroupsUpdate, groupId, groupDef),
        delete: (groupId: SharedAssetGroupId) => ipcRenderer.send(Channels.AssetGroupsDelete, groupId),
    },

    image: {
        getMeta: (imageFilePath: string) => ipcRenderer.invoke(Channels.ImageGetMeta, imageFilePath),
    },

    conversion: {
        enqueue: (assetId: SharedAssetId) => ipcRenderer.send(Channels.ConversionEnqueue, assetId),
        enqueueAll: () => ipcRenderer.send(Channels.ConversionEnqueueAll),
        startAgent: () => ipcRenderer.send(Channels.ConversionAgentStart),
        stopAgent: () => ipcRenderer.send(Channels.ConversionAgentStop),
        subscribeUpdated: (callback: (event: SharedConversionUpdateIpcEvent) => void) =>
            ipcRenderer.on(Channels.ConversionUpdated, (e: IpcRendererEvent, event: SharedConversionUpdateIpcEvent) =>
                callback(event),
            ),
        getState: () => ipcRenderer.invoke(Channels.ConversionGetState),
        clearEvents: () => ipcRenderer.send(Channels.ConversionClearEvents),
    },

    hotReload: {
        setEnabled: (enable: boolean) => ipcRenderer.send(Channels.HotReloadSetEnabled, enable),
        reloadChamberSignConfig: () => ipcRenderer.send(Channels.HotReloadChamberSignConfig),
    },

    webUtils: {
        getPathForFile: (file: File) => webUtils.getPathForFile(file),
    },

    clipboard: {
        writeText: (text: string, type?: "selection" | "clipboard") =>
            ipcRenderer.send(Channels.ClipboardWriteText, text, type),
    },

    interop: {
        subscribeConnected: (callback: () => void) => ipcRenderer.on(Channels.InteropConnected, () => callback()),
        subscribeDisconnected: (callback: () => void) => ipcRenderer.on(Channels.InteropDisconnected, () => callback()),
        subscribeLog: (callback: (message: string) => void) =>
            ipcRenderer.on(Channels.InteropLog, (e: IpcRendererEvent, message: string) => callback(message)),
        sendCommand: (command: string) => ipcRenderer.send(Channels.InteropSendCommand, command),
    },

    fgd: {
        build: () => ipcRenderer.invoke(Channels.FgdBuild),
    },

    tcArtifacts: {
        isConnected: () => ipcRenderer.invoke(Channels.TcArtifacts_IsConnected),
        listAllMaps: () => ipcRenderer.invoke(Channels.TcArtifacts_ListAllMaps),
        downloadMap: (artifactKey: string, mapPath: string) =>
            ipcRenderer.invoke(Channels.TcArtifacts_DownloadMap, artifactKey, mapPath),
    },

    log: {
        sendFromRenderer: (event: SharedLogEvent) => ipcRenderer.send(Channels.LogSendFromRenderer, event),
        subscribeSendFromMain: (callback: (logEvent: SharedLogEvent) => void) =>
            ipcRenderer.on(Channels.LogSendFromMain, (e: IpcRendererEvent, logEvent: SharedLogEvent) =>
                callback(logEvent),
            ),
    },

    mdl: {
        info: (filePath: string) => ipcRenderer.invoke(Channels.MdlInfoGet, filePath),
    },
});
