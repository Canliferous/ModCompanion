import { ipcMain } from "electron";
import { SharedIpcChannels } from "Shared/SharedIpcChannels.js";
import * as child_process from "node:child_process";
import { getAppConfig } from "../systems/MainConfigSystem.js";
import { Logger } from "../systems/MainLogSystem.js";
import { SharedLogChannel } from "Shared/SharedLogger.js";

export function registerFgdApi(): boolean {
    ipcMain.handle(SharedIpcChannels.FgdBuild, () => {
        return new Promise<boolean>((resolve) => {
            const cmd = `python content/revolution/fgd_builder/unify_fgd.py exp revolution srctools -o "game/revolution/revolution2.fgd"`;
            const proc = child_process.exec(cmd, { cwd: getAppConfig().rootPath }, (error, stdout, stderr) => {
                if (error) {
                    Logger.warning(SharedLogChannel.Fgd, error);
                }
                if (stdout) {
                    Logger.info(SharedLogChannel.Fgd, stdout);
                }
                if (stderr) {
                    Logger.warning(SharedLogChannel.Fgd, stderr);
                }
            });
            proc.on("exit", (code) => {
                resolve(code === 0);
            });
        });
    });
    return true;
}
