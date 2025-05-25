import { ipcMain } from "electron";
import { IpcChannels } from "./IpcChannels.js";
import { Launchers } from "../../shared/Launchers.js";
import * as child_process from "node:child_process";
import { getConfig } from "../systems/config-system.js";

export function registerLauncherApi(): boolean {
    ipcMain.on(IpcChannels.AppLaunch, (event, launcherType: Launchers, launcherArgs?: string) => {
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

export function getLauncherExe(launcherType: Launchers): string | undefined {
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
