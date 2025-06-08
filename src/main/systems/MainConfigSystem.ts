import path from "path";
import fs from "fs/promises";
import { SharedAppConfig } from "../../shared/SharedAppConfig.js";

interface ConfigFile {
    root?: string;
    searchPath?: string;
    mapSourceDirs?: string[];
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
        contentPath: path.join(root, "content"),
        gamePath: path.join(root, "game"),

        textureSourcePath: path.join(root, "content", c.searchPath, "materialsrc"),
        textureOutputPath: path.join(root, "game", c.searchPath, "materials"),
        modelSourcePath: path.join(root, "content", c.searchPath, "models"),
        modelOutputPath: path.join(root, "game", c.searchPath, "models"),
        mapSourcePath: path.join(root, "content", c.searchPath, "maps"),
        mapOutputPath: path.join(root, "game", c.searchPath, "maps"),

        studioMdlPath: path.join(root, "game/bin/win64/studiomdl.exe"),
        hlmvPath: path.join(root, "game/bin/win64/hlmv.exe"),
        hammerPath: path.join(root, "game/bin/win64/hammer.exe"),
        faceposerPath: path.join(root, "game/bin/win64/hlfaceposer.exe"),
        mdlInfoPath: path.join(root, "game/bin/win64/mdlinfo.exe"),
        gameExePath: path.join(root, "game/bin/win64/revolution.exe"),

        vbspExePath: path.join(root, "game/bin/win64/vbsp.exe"),
        postcompilerExePath: path.join(root, "game/bin/win64/postcompiler/postcompiler.exe"),
        vvisExePath: path.join(root, "game/bin/win64/vvis.exe"),
        vradExePath: path.join(root, "game/bin/win64/vrad.exe"),

        vbspArgs: `-game ${c.searchPath}`,
        postcompilerArgs: "--nopack",
        vvisArgs: `-game ${c.searchPath}`,
        vradArgs: `-PortalTraversalLighting -textureshadows -StaticPropLighting -StaticPropPolys -game ${c.searchPath}`,
        cubemapArgs: "-buildcubemaps -novid -windowed -w 800 -h 600 -condebug -bordered",

        mapSourceDirs: c.mapSourceDirs,
    };
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
