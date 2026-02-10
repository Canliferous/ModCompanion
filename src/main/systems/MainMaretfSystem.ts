import os from "node:os";
import fs from "node:fs";
import path from "node:path";
import * as child_process from "node:child_process";
import { getMainAssetsDir } from "../helpers/MainFilesystem.js";
import { buildMareTfCreateArgs, SharedVtfCreateOptions } from "Shared/vtf/SharedVtf.js";
import { runConverter } from "./converter/MainSharedConverter.js";
import { getAppConfig } from "./MainConfigSystem.js";
import { Logger } from "./MainLogSystem.js";
import { SharedLogChannel } from "Shared/SharedLogger.js";

let binary = "";

export const MareTfSystem = {
    initSystem(): boolean {
        if (os.type().toLowerCase() === "linux") {
            binary = path.join(getMainAssetsDir(), "lib", "maretf");

            child_process.spawnSync(`chmod +x ${binary}`, { shell: true });
            return true;
        }
        if (os.type().toLowerCase() === "windows_nt") {
            binary = path.join(getMainAssetsDir(), "lib", "maretf.exe");
            return true;
        }

        Logger.warning(SharedLogChannel.MareTF, "Cannot determine binary for maretf");
        return false;
    },
    async createVtf(inputPath: string, outputPath: string, options: SharedVtfCreateOptions = {}): Promise<string> {
        const cmd = _buildMateTfCreateCommand(inputPath, outputPath, options);

        try {
            const dir = path.dirname(outputPath);
            fs.mkdirSync(dir, { recursive: true });
        } catch (e) {
            // Nobody cares if the dir already exists
        }

        return runConverter(cmd, getAppConfig().gamePath, "MareTF");
    },
};

function _buildMateTfCreateCommand(inputPath: string, outputPath: string, options: SharedVtfCreateOptions): string {
    const args = buildMareTfCreateArgs(options);
    const cmd = `${binary} -y create ${inputPath} -o ${outputPath} ${args}`;
    return cmd;
}
