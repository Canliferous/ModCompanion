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

        const workingDir = getConfig().gameRootPath;

        let cmd = exe;
        if (launcherArgs) {
            cmd = `${exe} ${launcherArgs}`;
        }

        console.log(`Launching '${cmd}' Working Dir '${workingDir}'`);
        const proc = child_process.spawn(cmd, { cwd: workingDir, shell: true });
        // proc.stdout.on("data", (message) => {
        //     console.debug("Launched App: ", String(message));
        // });
        proc.on("error", (message) => {
            console.warn("Launched App: ", message);
        });
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
