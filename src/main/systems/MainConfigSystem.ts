import path from "path";
import fs from "fs/promises";
import { SharedAppConfig } from "Shared/SharedAppConfig.js";
import { SharedVtfCreateOptions } from "Shared/vtf/SharedVtf.js";
import os from "node:os";

interface ConfigFile {
    root?: string;
    searchPath?: string;
    mapSourceDirs?: string[];
    launcherName?: string;

    assetDefaults?: {
        vtfOptions?: SharedVtfCreateOptions;
    };
}

let config: SharedAppConfig = null!;

export function getConfig(): SharedAppConfig {
    return config;
}

export async function initConfigSystem(): Promise<boolean> {
    const cfgFile = await loadConfig();

    if (cfgFile === null) {
        return false;
    }

    const cfg = createRevolutionStandardConfig(cfgFile);
    if (!cfg) return false;

    config = cfg;
    return true;
}

export function createRevolutionStandardConfig(c: ConfigFile): SharedAppConfig | undefined {
    if (!c.root) {
        return undefined;
    }
    if (!c.searchPath) {
        return undefined;
    }

    const root = path.resolve(c.root);
    return {
        gameName: c.searchPath,
        rootPath: root,
        contentPath: path.join(root, "content", c.searchPath),
        gamePath: path.join(root, "game", c.searchPath),
        gameRootPath: path.join(root, "game"),

        textureSourcePath: path.join(root, "content", c.searchPath, "materialsrc"),
        textureOutputPath: path.join(root, "game", c.searchPath, "materials"),
        modelSourcePath: path.join(root, "content", c.searchPath, "models"),
        modelOutputPath: path.join(root, "game", c.searchPath, "models"),
        mapSourcePath: path.join(root, "content", c.searchPath, "maps"),
        mapOutputPath: path.join(root, "game", c.searchPath, "maps"),

        studioMdlPath: _buildBinaryPath(root, "studiomdl", true),
        hlmvPath: _buildBinaryPath(root, "hlmv", true),
        hammerPath: _buildBinaryPath(root, "hammer", true),
        faceposerPath: _buildBinaryPath(root, "hlfaceposer", true),
        mdlInfoPath: _buildBinaryPath(root, "mdlinfo"),
        gameExePath: _buildBinaryPath(root, c.launcherName ?? "revolution"),

        vbspExePath: _buildBinaryPath(root, "vbsp"),
        postcompilerExePath: path.join(root, "game/bin/win64/postcompiler/postcompiler.exe"),
        vvisExePath: _buildBinaryPath(root, "vvis"),
        vradExePath: _buildBinaryPath(root, "vrad"),

        vbspArgs: `-game ${c.searchPath} -report`,
        postcompilerArgs: "--nopack",
        vvisArgs: `-game ${c.searchPath} -report`,
        vradArgs: `-PortalTraversalLighting -textureshadows -StaticPropLighting -StaticPropPolys -report -game ${c.searchPath}`,
        cubemapArgs: "-buildcubemaps -novid -windowed -w 800 -h 600 -condebug -bordered",

        mapSourceDirs: c.mapSourceDirs,
        assetDefaults: c.assetDefaults,
    };
}

function _buildBinaryPath(root: string, binaryName: string, proton?: boolean): string {
    const platform = os.platform();
    if (platform === "linux" && !proton) {
        return path.join(root, "game/bin/linux64", binaryName);
    }

    if (platform === "win32" || proton) {
        return path.join(root, "game/bin/win64", binaryName + ".exe");
    }

    console.warn("Unsupported operating system platform", platform);
    return path.join(root, binaryName);
}

export function getConfigPath(): string {
    return path.normalize("./appconfig.json");
}

export async function loadConfig(): Promise<ConfigFile | null> {
    try {
        const rawCfg = await fs.readFile(getConfigPath());

        const cfgAny = JSON.parse(rawCfg.toString("utf-8"));

        if (!cfgAny.root || typeof cfgAny.root !== "string") {
            return null;
        }

        if (!cfgAny.searchPath || typeof cfgAny.searchPath !== "string") {
            return null;
        }

        return cfgAny;
    } catch (e) {
        console.error(e);
        return null;
    }
}
