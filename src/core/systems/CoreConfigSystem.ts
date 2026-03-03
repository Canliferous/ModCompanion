import path from "path";
import fs from "fs/promises";
import { SharedAppConfig } from "Shared/SharedAppConfig.js";
import { SharedVtfCreateOptions } from "Shared/vtf/SharedVtf.js";
import os from "node:os";
import { S3ClientConfig } from "@aws-sdk/client-s3";
import { SharedMapPresets } from "Shared/SharedMapPreset.js";
import { Logger } from "./CoreLogSystem.js";
import { SharedLogChannel } from "Shared/SharedLogger.js";

interface ConfigFile {
    root?: string;
    searchPath?: string;
    launcherName?: string;

    assetDefaults?: {
        vtfOptions?: SharedVtfCreateOptions;
    };

    teamCityArtifactCloud?: S3ClientConfig;
    teamCityArtifactCloudBucket?: string;

    mapSourceDirs?: string[];
    mapPresets?: SharedMapPresets;
}

let config: SharedAppConfig = null!;

export function getAppConfig(): SharedAppConfig {
    return config;
}

export async function initConfigSystem(): Promise<boolean> {
    let cfgFile = await _loadConfig();

    if (cfgFile === undefined) {
        Logger.info(SharedLogChannel.MainSystems, "Starting with default config");
        cfgFile = _createDefaultConfig();
    }

    const cfg = _createRevolutionStandardConfig(cfgFile);
    if (!cfg) return false;

    config = cfg;
    return true;
}

function _createRevolutionStandardConfig(c: ConfigFile): SharedAppConfig | undefined {
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

        studioMdlPath: _buildBinaryPath(root, "studiomdl"),
        hlmvPath: _buildBinaryPath(root, "hlmv", true),
        hammerPath: _buildBinaryPath(root, "hammer", true),
        faceposerPath: _buildBinaryPath(root, "hlfaceposer", true),
        mdlInfoPath: _buildBinaryPath(root, "mdlinfo"),
        gameExePath: _buildBinaryPath(root, c.launcherName ?? "revolution"),

        vbspExePath: _buildBinaryPath(root, "vbsp"),
        postcompilerExePath: path.join(root, "game/bin/win64/postcompiler/postcompiler.exe"),
        vvisExePath: _buildBinaryPath(root, "vvis"),
        vradExePath: _buildBinaryPath(root, "vrad"),

        vbspArgs: `-report -game ${c.searchPath}`,
        postcompilerArgs: "--nopack",
        vvisArgs: `-report -game ${c.searchPath}`,
        vradArgs: `-report -PortalTraversalLighting -textureshadows -StaticPropLighting -StaticPropPolys -game ${c.searchPath}`,
        cubemapArgs: "-buildcubemaps -novid -windowed -w 800 -h 600 -condebug -bordered",

        chamberSignConfigJson: path.join(root, "game", c.searchPath, "scripts", "chamber_sign_config.json"),

        mapSourceDirs: c.mapSourceDirs,
        mapPresets: c.mapPresets,

        assetDefaults: c.assetDefaults,
        teamCityArtifactCloud: c.teamCityArtifactCloud,
        teamCityArtifactCloudBucket: c.teamCityArtifactCloudBucket,
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

    Logger.info(SharedLogChannel.MainSystems, "Unsupported operating system platform", platform);
    return path.join(root, binaryName);
}

function _getConfigPath(): string {
    return path.normalize("./appconfig.json");
}

function _createDefaultConfig(): ConfigFile {
    return {
        root: "sample",
        searchPath: "my_game",
    };
}

async function _loadConfig(): Promise<ConfigFile | undefined> {
    try {
        const rawCfg = await fs.readFile(_getConfigPath());

        const cfgAny = JSON.parse(rawCfg.toString("utf-8"));

        if (!cfgAny.root || typeof cfgAny.root !== "string") {
            return undefined;
        }

        if (!cfgAny.searchPath || typeof cfgAny.searchPath !== "string") {
            return undefined;
        }

        return cfgAny;
    } catch (e) {
        Logger.error(SharedLogChannel.MainSystems, "Error loading config", e);
        return undefined;
    }
}
