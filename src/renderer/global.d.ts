import { SharedLaunchers } from "../shared/SharedLaunchers.js";
import { MapSourceDir } from "../shared/SharedMapTypes.js";
import { IpcRenderer } from "electron";
import { SharedAppConfig } from "../shared/SharedAppConfig.js";
import { SharedMapCompileLogEvent } from "../shared/SharedMapCompileLogEvent.js";
import { SharedMapCompileProgressEvent } from "../shared/SharedMapCompileProgressEvent.js";

export {};

declare global {
    interface Window {
        electronAPI: {
            app: {
                launch: (launcherType: SharedLaunchers, launcherArgs: string | undefined) => void;
                exit: () => void;
            };
            config: {
                get: () => Promise<SharedAppConfig>;
            };
            map: {
                listSourceDirs: () => Promise<MapSourceDir[]>;
                enqueue: (mapPath: string) => void;
                subscribeQueueUpdated: (callback: (queue: string[]) => void) => IpcRenderer;
                subscribeCompileLog: (callback: (event: SharedMapCompileLogEvent) => void) => IpcRenderer;
                subscribeCompileProgress: (callback: (event: SharedMapCompileProgressEvent) => void) => IpcRenderer;
            };
        };
    }
}
