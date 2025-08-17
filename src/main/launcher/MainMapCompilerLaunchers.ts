import * as child_process from "node:child_process";
import { getConfig } from "../systems/MainConfigSystem.js";
import path from "path";

export type MapCompilerAction = (
    mapPath: string,
    onStdOut?: (msg: string) => void,
    onStdErr?: (msg: string) => void,
) => Promise<boolean>;

export const runVBsp: MapCompilerAction = (
    mapPath: string,
    onStdOut?: (msg: string) => void,
    onStdErr?: (msg: string) => void,
): Promise<boolean> => {
    const config = getConfig();

    return runMapCompiler(mapPath, config.vbspExePath, config.vbspArgs, onStdOut, onStdErr);
};

export const runVVis: MapCompilerAction = (
    mapPath: string,
    onStdOut?: (msg: string) => void,
    onStdErr?: (msg: string) => void,
): Promise<boolean> => {
    const config = getConfig();

    return runMapCompiler(mapPath, config.vvisExePath, config.vvisArgs, onStdOut, onStdErr);
};

export const runVRad: MapCompilerAction = (
    mapPath: string,
    onStdOut?: (msg: string) => void,
    onStdErr?: (msg: string) => void,
): Promise<boolean> => {
    const config = getConfig();

    return runMapCompiler(mapPath, config.vradExePath, config.vradArgs, onStdOut, onStdErr);
};

function runMapCompiler(
    mapPath: string,
    exePath: string,
    args: string,
    onStdOut?: (msg: string) => void,
    onStdErr?: (msg: string) => void,
): Promise<boolean> {
    const config = getConfig();
    const map = path.join(config.mapSourcePath, mapPath);
    const cmd = `${exePath} ${args} ${map}`;
    const cwd = path.join(config.rootPath, "game");

    console.log("Running map compiler", cmd, cwd);
    return new Promise((resolve, reject) => {
        const proc = child_process.exec(cmd, { cwd }, (error, stdout, stderr) => {
            if (stdout) {
                onStdOut?.(stdout);
            }
            if (stderr) {
                onStdErr?.(stderr);
            }
        });
        proc.on("exit", (code) => {
            resolve(code === 1);
        });
    });
}
