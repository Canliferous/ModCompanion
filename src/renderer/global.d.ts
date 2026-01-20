import { SharedLaunchers } from "../shared/SharedLaunchers.js";
import { SharedMapSourceDir } from "../shared/SharedMapTypes.js";
import { ipcRenderer, IpcRenderer } from "electron";
import { SharedAppConfig } from "../shared/SharedAppConfig.js";
import { SharedMapCompileLogEvent } from "../shared/SharedMapCompileLogEvent.js";
import { SharedMapCompileProgressEvent } from "../shared/SharedMapCompileProgressEvent.js";
import { SharedMapPath } from "../shared/SharedMapPath.js";
import { SharedMapTimeReport } from "../shared/SharedMapTimeReport.js";
import {
    SharedAsset,
    SharedAssetAddedEvent,
    SharedAssetDefinition,
    SharedAssetId,
    SharedAssetRescanEvent,
    SharedAssetUpdatedEvent,
} from "Shared/SharedAssetDefinition.js";
import { SharedImageMetaReport } from "Shared/SharedImageMetaReport.js";
import { SharedConversionGetStateIpcReport, SharedConversionUpdateIpcEvent } from "Shared/SharedConversion.js";
import { SharedFileBrowserDirectoryUpdatedReport, SharedProjectListFilesReport } from "Shared/SharedFileListing.js";
import { SharedCreateAssetReport } from "Shared/SharedCreateAssetReport.js";
import {
    SharedAssetGroup,
    SharedAssetGroupDefinition,
    SharedAssetGroupId,
    SharedAssetGroupRescanEvent,
} from "Shared/SharedAssetGroup.js";
import { SharedTcArtifactsListAllMapsReport } from "Shared/SharedTcArtifacts.js";
import { SharedLogEvent } from "Shared/SharedLogger.js";
import { SharedIpcChannels } from "Shared/SharedIpcChannels.js";

export {};

declare global {
    interface Window {
        electronAPI: {
            app: {
                launch: (launcherType: SharedLaunchers, launcherArgs: string | undefined) => void;
                exit: () => void;
            };
            fileBrowser: {
                listFiles: (dirPath: string) => Promise<SharedProjectListFilesReport>;
                correctPath: (dirPath: string) => Promise<string | undefined>;
                launchFile: (filePath: string | string[]) => void;
                setCurrentPath: (dirPath: string) => void;
                browseToFile: (filePath: string) => void;
                openFile: (filePath: string) => void;
                subscribeDirectoryChanged: (
                    callback: (event: SharedFileBrowserDirectoryUpdatedReport) => void,
                ) => IpcRenderer;
            };
            file: {
                readString: (filePath: string) => Promise<string>;
            };
            config: {
                get: () => Promise<SharedAppConfig>;
            };
            map: {
                listSourceDirs: () => Promise<SharedMapSourceDir[]>;
                enqueue: (mapPaths: string[]) => void;
                subscribeQueueUpdated: (callback: (queue: string[]) => void) => IpcRenderer;
                cancelQueue: () => void;
                pauseQueue: (paused: boolean) => void;
                subscribeCompileLog: (callback: (event: SharedMapCompileLogEvent) => void) => IpcRenderer;
                subscribeCompileProgress: (callback: (event: SharedMapCompileProgressEvent) => void) => IpcRenderer;
                createTimeReport: (maps: SharedMapPath[]) => Promise<SharedMapTimeReport>;
            };
            asset: {
                forceRescan: () => void;
                subscribeRescanned: (callback: (event: SharedAssetRescanEvent) => void) => IpcRenderer;
                subscribeAdded: (callback: (event: SharedAssetAddedEvent) => void) => IpcRenderer;
                subscribeUpdated: (callback: (event: SharedAssetUpdatedEvent) => void) => IpcRenderer;
                subscribeNavigateToHash: (callback: (assetHash: string) => void) => IpcRenderer;
                createAsset: (primaryFile: string, otherFiles: string[]) => Promise<SharedCreateAssetReport>;
                update: (assetId: SharedAssetId, assetDef: SharedAssetDefinition) => Promise<SharedAsset | undefined>;
                delete: (assetId: SharedAssetId) => Promise<boolean>;
            };
            assetGroups: {
                forceRescan: () => void;
                subscribeRescanned: (callback: (event: SharedAssetGroupRescanEvent) => void) => IpcRenderer;
                create: (groupDef: SharedAssetGroupDefinition) => Promise<SharedAssetGroup>;
                update: (
                    groupId: SharedAssetGroupId,
                    groupDef: SharedAssetGroupDefinition,
                ) => Promise<SharedAssetGroup>;
                delete: (groupId: SharedAssetGroupId) => void;
            };
            image: {
                getMeta: (imageFilePath: string) => Promise<SharedImageMetaReport | undefined>;
            };
            conversion: {
                enqueue: (assetId: SharedAssetId) => void;
                startAgent: () => void;
                stopAgent: () => void;
                subscribeUpdated: (callback: (event: SharedConversionUpdateIpcEvent) => void) => IpcRenderer;
                getState: () => Promise<SharedConversionGetStateIpcReport>;
                clearEvents: () => void;
            };
            hotReload: {
                setEnabled: (enable: boolean) => void;
            };
            webUtils: {
                getPathForFile: (file: File) => string;
            };
            clipboard: {
                writeText: (text: string, type?: "selection" | "clipboard") => void;
            };
            interop: {
                subscribeConnected: (callback: () => void) => IpcRenderer;
                subscribeDisconnected: (callback: () => void) => IpcRenderer;
                subscribeLog: (callback: (message: string) => void) => IpcRenderer;
                sendCommand: (command: string) => void;
            };
            fgd: {
                build: () => Promise<boolean>;
            };
            tcArtifacts: {
                isConnected: () => Promise<boolean>;
                listAllMaps: () => Promise<SharedTcArtifactsListAllMapsReport>;
            };
            log: {
                sendFromRenderer: (event: SharedLogEvent) => void;
                subscribeSendFromMain: (callback: (event: SharedLogEvent) => void) => IpcRenderer;
            };
        };
    }
}
