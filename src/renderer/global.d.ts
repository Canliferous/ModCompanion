import { SharedLaunchers } from "../shared/SharedLaunchers.js";
import { SharedMapSourceDir } from "../shared/SharedMapTypes.js";
import { ipcRenderer, IpcRenderer, IpcRendererEvent } from "electron";
import { SharedAppConfig } from "../shared/SharedAppConfig.js";
import { SharedMapCompileLogEvent } from "../shared/SharedMapCompileLogEvent.js";
import { SharedMapCompileProgressEvent } from "../shared/SharedMapCompileProgressEvent.js";
import { SharedIpcChannels } from "../shared/SharedIpcChannels.js";
import { SharedMapPath } from "../shared/SharedMapPath.js";
import { SharedMapTimeReport } from "../shared/SharedMapTimeReport.js";
import { SharedAsset, SharedAssetRescanEvent } from "../shared/SharedAsset.js";

export {};

declare global {
    interface Window {
        electronAPI: {
            app: {
                launch: (launcherType: SharedLaunchers, launcherArgs: string | undefined) => void;
                exit: () => void;
                browseToFile: (filePath: string) => void;
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
            };
        };
    }
}
