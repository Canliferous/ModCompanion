import { Launchers } from "../shared/Launchers.js";

export {};

declare global {
    interface Window {
        electronAPI: {
            launch: (launcherType: Launchers) => void;
            listMapSourceDirs: () => Promise<string[]>;
        };
    }
}
