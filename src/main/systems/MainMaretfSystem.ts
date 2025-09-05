import os from "node:os";
import path from "node:path";
import * as child_process from "node:child_process";
import { getMainAssetsDir } from "../helpers/MainFilesystem.js";
import { buildMareTfCreateArgs, SharedVtfCreateOptions } from "Shared/vtf/SharedVtf.js";

let binary = "";

export function initMateTfSystem(): boolean {
    if (os.type().toLowerCase() === "linux") {
        binary = path.join(getMainAssetsDir(), "lib", "maretf");
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

    // TODO: String builder or something faster??
    let log = "";

    return new Promise((resolve, reject) => {
        const proc = child_process.exec(cmd, {}, (error, stdout, stderr) => {
            if (error) {
                log += error;
                console.warn("Maretf ERROR", error);
            }
            if (stderr) {
                log += stderr;
                console.debug("Maretf ERROR", stderr);
            }
            if (stdout) {
                log += stdout;
                console.debug("Maretf", stdout);
            }
        });
        proc.on("exit", (code) => {
            resolve(log);
        });
    });
}

function _buildMateTfCreateCommand(inputPath: string, outputPath: string, options: SharedVtfCreateOptions): string {
    const args = buildMareTfCreateArgs(options);
    const cmd = `${binary} create ${inputPath} --yes -o ${outputPath} ${args}`;
    return cmd;
}
