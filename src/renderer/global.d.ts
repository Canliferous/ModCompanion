import { Launchers } from "../shared/Launchers.js";
import { MapSourceDir } from "../shared/SharedMapTypes.js";

export {};

declare global {
    interface Window {
        electronAPI: {
            launch: (launcherType: Launchers) => void;
            listMapSourceDirs: () => Promise<MapSourceDir[]>;
        };
    }
}
