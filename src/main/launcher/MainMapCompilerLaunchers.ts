import * as child_process from "node:child_process";
import { getAppConfig } from "../systems/MainConfigSystem.js";
import path from "path";
import fs from "fs/promises";

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
    const config = getAppConfig();
    return _runMapCompiler(mapPath, config.vbspExePath, config.vbspArgs, onStdOut, onStdErr);
};

export const runVVis: MapCompilerAction = (
    mapPath: string,
    onStdOut?: (msg: string) => void,
    onStdErr?: (msg: string) => void,
): Promise<boolean> => {
    const config = getAppConfig();
    return _runMapCompiler(mapPath, config.vvisExePath, config.vvisArgs, onStdOut, onStdErr);
};

export const runVRad: MapCompilerAction = (
    mapPath: string,
    onStdOut?: (msg: string) => void,
    onStdErr?: (msg: string) => void,
): Promise<boolean> => {
    const config = getAppConfig();
    return _runMapCompiler(mapPath, config.vradExePath, config.vradArgs, onStdOut, onStdErr);
};

export const runPostcompiler: MapCompilerAction = (
    mapPath: string,
    onStdOut?: (msg: string) => void,
    onStdErr?: (msg: string) => void,
): Promise<boolean> => {
    const config = getAppConfig();
    return _runMapCompiler(mapPath, config.postcompilerExePath, config.postcompilerArgs, onStdOut, onStdErr);
};

export const runDone: MapCompilerAction = async (
    mapPath: string,
    onStdOut?: (msg: string) => void,
    onStdErr?: (msg: string) => void,
): Promise<boolean> => {
    const config = getAppConfig();
    const sourceBsp = mapPath.replace(".vmf", ".bsp");
    const outBsp = path.basename(sourceBsp);
    const from = path.join(config.mapSourcePath, sourceBsp);
    const to = path.join(config.mapOutputPath, outBsp);

    try {
        await fs.copyFile(from, to);
        onStdOut?.(`Copied file ${from} ${to}`);
        return true;
    } catch (e) {
        onStdErr?.(`Failed to copy file ${from} ${to}`);
        return false;
    }
};

function _runMapCompiler(
    mapPath: string,
    exePath: string,
    args: string,
    onStdOut?: (msg: string) => void,
    onStdErr?: (msg: string) => void,
): Promise<boolean> {
    const config = getAppConfig();
    const map = path.join(config.mapSourcePath, mapPath);
    const cmd = `${exePath} ${args} ${map}`;
    const cwd = path.join(config.rootPath, "game");

    return _runCommand(cmd, cwd, onStdOut, onStdErr);
}

function _runCommand(
    cmd: string,
    cwd: string,
    onStdOut?: (msg: string) => void,
    onStdErr?: (msg: string) => void,
): Promise<boolean> {
    console.log("Running map command", cmd, cwd);
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
