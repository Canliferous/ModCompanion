import { Launchers } from "../shared/Launchers.js";
import { MapSourceDir } from "../shared/SharedMapTypes.js";
import { ipcRenderer, IpcRenderer } from "electron";

export {};

declare global {
    interface Window {
        electronAPI: {
            launch: (launcherType: Launchers) => void;
            listMapSourceDirs: () => Promise<MapSourceDir[]>;
            exitApp: () => void;
            mapQueueAdd: (mapPath: string) => void;
            subscribeMapQueueUpdated: (callback: (arg: any) => void) => IpcRenderer;
        };
    }
}
