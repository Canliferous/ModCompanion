import { ipcMain } from "electron";
import { SharedIpcChannels } from "Shared/SharedIpcChannels.js";
import { SharedLaunchers } from "Shared/SharedLaunchers.js";
import * as child_process from "node:child_process";
import { getAppConfig } from "../systems/MainConfigSystem.js";
import os from "node:os";
import { Logger } from "../systems/MainLogSystem.js";
import { SharedLogChannel } from "Shared/SharedLogger.js";

export function registerLauncherApi(): boolean {
    ipcMain.on(SharedIpcChannels.AppLaunch, (event, launcherType: SharedLaunchers, launcherArgs?: string) => {
        runLauncher(launcherType, launcherArgs);
    });

    return true;
}

export function runLauncher(type: SharedLaunchers, args?: string) {
    const exe = _getLauncherExe(type);
    if (!exe) {
        console.warn("Unknown launcher type", type);
        return;
    }

    const workingDir = getAppConfig().gameRootPath;

    let cmd = exe;
    if (args) {
        cmd = `${exe} ${args}`;
    }

    if (_isWine(exe) && os.platform() === "linux") {
        cmd = `wine ${cmd}`;
    }

    if (!cmd.includes("-game")) {
        cmd += ` -game ${getAppConfig().gameName}`;
    }

    Logger.info(SharedLogChannel.Generic, `Launching '${cmd}' Working Dir '${workingDir}'`);
    const proc = child_process.spawn(cmd, { cwd: workingDir, shell: true });
    // proc.stdout.on("data", (message) => {
    //     console.debug("Launched App: ", String(message));
    // });
    proc.on("error", (message) => {
        Logger.warning(SharedLogChannel.Generic, "Launched App: ", message);
    });
}

function _getLauncherExe(launcherType: SharedLaunchers): string | undefined {
    const config = getAppConfig();
    switch (launcherType) {
        case SharedLaunchers.Game:
            return config.gameExePath;
        case SharedLaunchers.Hammer:
            return config.hammerPath;
        case SharedLaunchers.Hlmv:
            return config.hlmvPath;
        case SharedLaunchers.Faceposer:
            return config.faceposerPath;
        default:
            return undefined;
    }
}

function _isWine(binaryPath: string) {
    return binaryPath.includes("win64");
}
