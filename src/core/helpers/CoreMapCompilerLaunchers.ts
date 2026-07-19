import * as child_process from "node:child_process";
import { ConfigSystem } from "../systems/CoreConfigSystem.js";
import * as pathe from "pathe";
import fs from "fs/promises";
import { Logger } from "../systems/CoreLogSystem.js";
import * as Shared from "mod_companion_shared";

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
    const config = ConfigSystem.getAppConfig();
    return _runMapCompiler(mapPath, config.vbspExePath, config.vbspArgs, onStdOut, onStdErr);
};

export const runVVis: MapCompilerAction = (
    mapPath: string,
    onStdOut?: (msg: string) => void,
    onStdErr?: (msg: string) => void,
): Promise<boolean> => {
    const config = ConfigSystem.getAppConfig();
    return _runMapCompiler(mapPath, config.vvisExePath, config.vvisArgs, onStdOut, onStdErr);
};

export const runVRad: MapCompilerAction = (
    mapPath: string,
    onStdOut?: (msg: string) => void,
    onStdErr?: (msg: string) => void,
): Promise<boolean> => {
    const config = ConfigSystem.getAppConfig();
    return _runMapCompiler(mapPath, config.vradExePath, config.vradArgs, onStdOut, onStdErr);
};

export const runPostcompiler: MapCompilerAction = (
    mapPath: string,
    onStdOut?: (msg: string) => void,
    onStdErr?: (msg: string) => void,
): Promise<boolean> => {
    const config = ConfigSystem.getAppConfig();
    return _runMapCompiler(mapPath, config.postcompilerExePath, config.postcompilerArgs, onStdOut, onStdErr);
};

export const runDone: MapCompilerAction = async (
    mapPath: string,
    onStdOut?: (msg: string) => void,
    onStdErr?: (msg: string) => void,
): Promise<boolean> => {
    const config = ConfigSystem.getAppConfig();
    const sourceBsp = pathe.extname(mapPath) === ".vmf" ? mapPath.replace(".vmf", ".bsp") : mapPath + ".bsp";
    const outBsp = pathe.basename(sourceBsp);
    const from = pathe.join(config.mapSourcePath, sourceBsp);
    const to = pathe.join(config.mapOutputPath, outBsp);

    try {
        await fs.copyFile(from, to);
        onStdOut?.(`Copied file ${from} ${to}`);
        return true;
    } catch {
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
    const config = ConfigSystem.getAppConfig();
    const map = pathe.join(config.mapSourcePath, mapPath);
    const cwd = pathe.join(config.rootPath, "game");

    return _runCommand(exePath, [...args.split(" "), map], cwd, onStdOut, onStdErr);
}

function _runCommand(
    binaryPath: string,
    args: string[],
    cwd: string,
    onStdOut?: (msg: string) => void,
    onStdErr?: (msg: string) => void,
): Promise<boolean> {
    Logger.info(Shared.Log.Channel.MapCompile, `Running map command ${binaryPath} ${args} in ${cwd}`);

    return new Promise((resolve) => {
        const proc = child_process.spawn(binaryPath, args, { cwd });

        if (onStdOut) proc.stdout.on("data", (o: any) => onStdOut(o.toString()));
        if (onStdErr) proc.stderr.on("data", (o: any) => onStdErr(o.toString()));
        if (onStdErr) proc.on("error", (o: any) => onStdErr(o.toString()));

        proc.on("close", (code: number) => {
            resolve(code === 1);
        });
    });
}
