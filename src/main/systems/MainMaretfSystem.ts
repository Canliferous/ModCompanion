import os from "node:os";
import fs from "node:fs";
import path from "node:path";
import * as child_process from "node:child_process";
import { getMainAssetsDir } from "../helpers/MainFilesystem.js";
import { buildMareTfCreateArgs, SharedVtfCreateOptions } from "Shared/vtf/SharedVtf.js";

let binary = "";

export function initMateTfSystem(): boolean {
    if (os.type().toLowerCase() === "linux") {
        binary = path.join(getMainAssetsDir(), "lib", "maretf");

        child_process.spawnSync(`chmod +x ${binary}`, { shell: true });
        return true;
    }
    if (os.type().toLowerCase() === "windows_nt") {
        binary = path.join(getMainAssetsDir(), "lib", "maretf.exe");
        return true;
    }

    console.error("Cannot determine binary for maretf");
    return false;
}

export async function createVtf(
    inputPath: string,
    outputPath: string,
    options: SharedVtfCreateOptions = {},
): Promise<string> {
    const cmd = _buildMateTfCreateCommand(inputPath, outputPath, options);
    console.log("Creating vtf. cmd:", cmd);

    let log: string[] = [];
    try {
        const dir = path.dirname(outputPath);
        console.log("Mkdir", dir);
        fs.mkdirSync(dir, { recursive: true });
    } catch (e) {
        console.log(e);
    } // Nobody cares if the dir already exists

    return new Promise((resolve, reject) => {
        try {
            const proc = child_process.spawn(cmd, { shell: true });
            proc.stdout?.on("data", (d) => {
                log.push(d);
            });
            proc.on("exit", (code) => {
                resolve(log.join());
            });
        } catch (e) {
            if (typeof e === "string") {
                resolve(e);
            } else {
                resolve("");
            }
        }
    });
}

function _buildMateTfCreateCommand(inputPath: string, outputPath: string, options: SharedVtfCreateOptions): string {
    const args = buildMareTfCreateArgs(options);
    const cmd = `${binary} create ${inputPath} --yes -o ${outputPath} ${args}`;
    return cmd;
}
