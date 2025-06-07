import { Launchers } from "../shared/Launchers.js";
import { MapSourceDir } from "../shared/SharedMapTypes.js";
import { IpcRenderer } from "electron";
import { AppConfig } from "../shared/AppConfig.js";
import { MapCompileLogEvent } from "../shared/MapCompileLogEvent.js";

export {};

declare global {
    interface Window {
        electronAPI: {
            app: {
                launch: (launcherType: Launchers, launcherArgs: string | undefined) => void;
                exit: () => void;
            };
            config: {
                get: () => Promise<AppConfig>;
            };
            map: {
                listSourceDirs: () => Promise<MapSourceDir[]>;
                enqueue: (mapPath: string) => void;
                subscribeQueueUpdated: (callback: (queue: string[]) => void) => IpcRenderer;
                subscribeCompileLog: (callback: (event: MapCompileLogEvent) => void) => IpcRenderer;
            };
        };
    }
}
