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
import { SharedConversionGetStateReport, SharedConversionUpdateEvent } from "Shared/SharedConversion.js";
import { SharedFsEntry } from "Shared/SharedFileListing.js";
import { SharedCreateAssetReport } from "Shared/SharedCreateAssetReport.js";
import { SharedAssetGroup, SharedAssetGroupDefinition, SharedAssetGroupRescanEvent } from "Shared/SharedAssetGroup.js";
import { SharedIpcChannels } from "Shared/SharedIpcChannels.js";

export {};

declare global {
    interface Window {
        electronAPI: {
            app: {
                launch: (launcherType: SharedLaunchers, launcherArgs: string | undefined) => void;
                exit: () => void;
                browseToFile: (filePath: string) => void;
                openFile: (filePath: string) => void;
            };
            project: {
                listFiles: (dirPath: string) => Promise<SharedFsEntry[]>;
                correctPath: (dirPath: string) => Promise<string | undefined>;
                launchFile: (filePath: string | string[]) => void;
            };
            config: {
                get: () => Promise<SharedAppConfig>;
            };
            map: {
                listSourceDirs: () => Promise<SharedMapSourceDir[]>;
                enqueue: (mapPath: string) => void;
                subscribeQueueUpdated: (callback: (queue: string[]) => void) => IpcRenderer;
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
            };
            assetGroups: {
                forceRescan: () => void;
                subscribeRescanned: (callback: (event: SharedAssetGroupRescanEvent) => void) => IpcRenderer;
                create: (assetGroupDef: SharedAssetGroupDefinition) => Promise<SharedAssetGroup>;
            };
            image: {
                getMeta: (imageFilePath: string) => Promise<SharedImageMetaReport | undefined>;
            };
            conversion: {
                enqueue: (assetId: SharedAssetId) => void;
                startAgent: () => void;
                stopAgent: () => void;
                subscribeUpdated: (callback: (event: SharedConversionUpdateEvent) => void) => IpcRenderer;
                getState: () => Promise<SharedConversionGetStateReport>;
            };
            hotReload: {
                setEnabled: (enable: boolean) => void;
            };
            webUtils: {
                getPathForFile: (file: File) => string;
            };
        };
    }
}
