import { ipcMain } from "electron";
import { SharedIpcChannels } from "Shared/SharedIpcChannels.js";
import { SharedLaunchers } from "Shared/SharedLaunchers.js";
import * as child_process from "node:child_process";
import { getConfig } from "../systems/MainConfigSystem.js";

export function registerLauncherApi(): boolean {
    ipcMain.on(SharedIpcChannels.AppLaunch, (event, launcherType: SharedLaunchers, launcherArgs?: string) => {
        const exe = getLauncherExe(launcherType);
        if (!exe) {
            console.warn("Unknown launcher type", launcherType);
            return;
        }

        if (launcherArgs) {
            child_process.exec(`${exe} ${launcherArgs}`);
        } else {
            child_process.exec(exe);
        }
    });

    return true;
}

export function getLauncherExe(launcherType: SharedLaunchers): string | undefined {
    const config = getConfig();
    if (launcherType === "game") {
        return config.gameExePath;
    } else if (launcherType === "hammer") {
        return config.hammerPath;
    } else if (launcherType === "hlmv") {
        return config.hlmvPath;
    } else if (launcherType === "faceposer") {
        return config.faceposerPath;
    }

    return undefined;
}
