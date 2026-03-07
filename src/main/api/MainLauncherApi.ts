import { ipcMain } from "electron";
import * as child_process from "node:child_process";
import os from "node:os";

import * as Core from "mod_companion_core";
import * as Shared from "mod_companion_shared";

export function registerLauncherApi(): boolean {
    ipcMain.on(
        Shared.Ipc.Channels.AppLaunch,
        (event, launcherType: Shared.Launchers.SharedLaunchers, launcherArgs?: string) => {
            runLauncher(launcherType, launcherArgs);
        },
    );

    return true;
}

// todo this should be moved to core

export function runLauncher(type: Shared.Launchers.SharedLaunchers, args?: string) {
    const exe = _getLauncherExe(type);
    if (!exe) {
        console.warn("Unknown launcher type", type);
        return;
    }

    const workingDir = Core.ConfigSystem.getAppConfig().gameRootPath;

    let cmd = exe;
    if (args) {
        cmd = `${exe} ${args}`;
    }

    if (_isWine(exe) && os.platform() === "linux") {
        cmd = `wine ${cmd}`;
    }

    if (!cmd.includes("-game")) {
        cmd += ` -game ${Core.ConfigSystem.getAppConfig().gameName}`;
    }

    Core.Logger.info(Shared.Log.Channel.Generic, `Launching '${cmd}' Working Dir '${workingDir}'`);
    const proc = child_process.spawn(cmd, { cwd: workingDir, shell: true });
    // proc.stdout.on("data", (message) => {
    //     console.debug("Launched App: ", String(message));
    // });
    proc.on("error", (message) => {
        Core.Logger.warning(Shared.Log.Channel.Generic, "Launched App: ", message);
    });
}

function _getLauncherExe(launcherType: Shared.Launchers.SharedLaunchers): string | undefined {
    const config = Core.ConfigSystem.getAppConfig();
    switch (launcherType) {
        case Shared.Launchers.SharedLaunchers.Game:
            return config.gameExePath;
        case Shared.Launchers.SharedLaunchers.Hammer:
            return config.hammerPath;
        case Shared.Launchers.SharedLaunchers.Hlmv:
            return config.hlmvPath;
        case Shared.Launchers.SharedLaunchers.Faceposer:
            return config.faceposerPath;
        default:
            return undefined;
    }
}

function _isWine(binaryPath: string) {
    return binaryPath.includes("win64");
}
