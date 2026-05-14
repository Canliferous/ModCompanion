import { ipcMain } from "electron";

import * as Core from "mod_companion_core";
import * as Shared from "mod_companion_shared";

export function registerLauncherApi(): boolean {
    ipcMain.on(
        Shared.Ipc.Channels.AppLaunch,
        (event, launcherType: Shared.Launchers.Launchers, launcherArgs?: string) => {
            Core.LauncherHelper.runLauncher(launcherType, launcherArgs);
        },
    );

    return true;
}
