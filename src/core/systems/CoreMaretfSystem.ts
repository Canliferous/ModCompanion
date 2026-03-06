import os from "node:os";
import fs from "node:fs";
import path from "node:path";
import * as child_process from "node:child_process";
import { getMainAssetsDir } from "../helpers/CoreFilesystem.js";
import { runConverter } from "../helpers/converter/CoreSharedConverter.js";
import { getAppConfig } from "./CoreConfigSystem.js";
import { Logger } from "./CoreLogSystem.js";
import * as Shared from "mod_companion_shared";

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

        Logger.warning(Shared.Log.Channel.MareTF, "Cannot determine binary for maretf");
        return false;
    },
    async createVtf(
        inputPath: string,
        outputPath: string,
        options: Shared.Vtf.SharedVtfCreateOptions = {},
    ): Promise<string> {
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

function _buildMateTfCreateCommand(
    inputPath: string,
    outputPath: string,
    options: Shared.Vtf.SharedVtfCreateOptions,
): string {
    const args = Shared.Vtf.buildMareTfCreateArgs(options);
    const cmd = `${binary} -y create ${inputPath} -o ${outputPath} ${args}`;
    return cmd;
}
