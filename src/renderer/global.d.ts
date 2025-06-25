import { SharedLaunchers } from "../shared/SharedLaunchers.js";
import { SharedMapSourceDir } from "../shared/SharedMapTypes.js";
import { ipcRenderer, IpcRenderer, IpcRendererEvent } from "electron";
import { SharedAppConfig } from "../shared/SharedAppConfig.js";
import { SharedMapCompileLogEvent } from "../shared/SharedMapCompileLogEvent.js";
import { SharedMapCompileProgressEvent } from "../shared/SharedMapCompileProgressEvent.js";
import { SharedIpcChannels } from "../shared/SharedIpcChannels.js";
import { SharedMapPath } from "../shared/SharedMapPath.js";
import { SharedMapTimeReport } from "../shared/SharedMapTimeReport.js";
import { SharedAsset, SharedAssetAddedEvent, SharedAssetRescanEvent } from "../shared/SharedAsset.js";
import { SharedImageMetaReport } from "Shared/SharedImageMetaReport.js";
import { getImageMeta } from "../main/api/MainImageMetaApi.js";

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
                subscribeNavigateToHash: (callback: (assetHash: string) => void) => IpcRenderer;
            };
            image: {
                getMeta: (imageFilePath: string) => Promise<SharedImageMetaReport | undefined>;
            };
        };
    }
}
