import { ipcMain } from "electron";
import { IpcChannels } from "./IpcChannels.js";
import { Launchers } from "../../shared/Launchers.js";
import * as child_process from "node:child_process";
import { getConfig } from "../systems/config-system.js";

export function registerLauncherApi(): boolean {
    ipcMain.on(IpcChannels.Launch, (event, launcherType: Launchers) => {
        const config = getConfig();
        console.log(launcherType);
        if (launcherType === "game") {
            child_process.exec(`${config.gameExePath}`);
        } else if (launcherType === "game_dev") {
            child_process.exec(`${config.gameExePath} -dev -condebug -novid`);
        } else if (launcherType === "game_tools") {
            child_process.exec(`${config.gameExePath} -tools`);
        } else if (launcherType === "hammer") {
            console.log(`${config.hammerPath} -game ${config.gameName}`);
            child_process.exec(`${config.hammerPath} -game ${config.gameName}`);
        } else if (launcherType === "hlmv") {
            child_process.exec(`${config.hlmvPath} -game ${config.gameName}`);
        } else if (launcherType === "faceposer") {
            child_process.exec(`${config.faceposerPath} -game ${config.gameName}`);
        }
    });

    return true;
}
