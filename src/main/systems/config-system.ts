import path from "path";
import fs from "fs/promises";

export interface AppConfig {
    rootPath: string;
    contentPath: string;
    gamePath: string;

    textureSourcePath: string;
    textureOutputPath: string;

    modelSourcePath: string;
    modelOutputPath: string;

    mapSourcePath: string;
    mapOutputPath: string;

    studioMdlPath: string;
    hlmvPath: string;
    hammerPath: string;
    faceposerPath: string;
    mdlInfoPath: string;
    gameExePath: string;

    vbspExePath: string;
    vradExePath: string;
    vvisExePath: string;
    postcompilerExePath: string;

    vbspArgs: string;
    vradArgs: string;
    vvisArgs: string;
    postcompilerArgs: string;
    cubemapArgs: string;

    gameName: string;
}

interface ConfigFile {
    root: string;
    searchPath: string;
}

let config: AppConfig = null!;

export function getConfig(): AppConfig {
    return config;
}

export async function initConfigSystem(): Promise<boolean> {
    const cfgFile = await loadConfig();

    if (cfgFile === null) {
        return false;
    }

    config = createRevolutionStandardConfig(cfgFile.root, cfgFile.searchPath);
    return true;
}

export function createRevolutionStandardConfig(rootPath: string, searchPath: string): AppConfig {
    return {
        gameName: searchPath,
        rootPath: rootPath,
        contentPath: path.join(rootPath, "content"),
        gamePath: path.join(rootPath, "game"),

        textureSourcePath: path.join(rootPath, "content", searchPath, "materialsrc"),
        textureOutputPath: path.join(rootPath, "game", searchPath, "materials"),
        modelSourcePath: path.join(rootPath, "content", searchPath, "models"),
        modelOutputPath: path.join(rootPath, "game", searchPath, "models"),
        mapSourcePath: path.join(rootPath, "content", searchPath, "maps"),
        mapOutputPath: path.join(rootPath, "game", searchPath, "maps"),

        studioMdlPath: path.join(rootPath, "game/bin/win64/studiomdl.exe"),
        hlmvPath: path.join(rootPath, "game/bin/win64/hlmv.exe"),
        hammerPath: path.join(rootPath, "game/bin/win64/hammer.exe"),
        faceposerPath: path.join(rootPath, "game/bin/win64/hlfaceposer.exe"),
        mdlInfoPath: path.join(rootPath, "game/bin/win64/mdlinfo.exe"),
        gameExePath: path.join(rootPath, "game/bin/win64/revolution.exe"),

        vbspExePath: path.join(rootPath, "game/bin/win64/vbsp.exe"),
        postcompilerExePath: path.join(rootPath, "game/bin/win64/postcompiler/postcompiler.exe"),
        vvisExePath: path.join(rootPath, "game/bin/win64/vvis.exe"),
        vradExePath: path.join(rootPath, "game/bin/win64/vrad.exe"),

        vbspArgs: `-game ${searchPath}`,
        postcompilerArgs: "--nopack",
        vvisArgs: `-game ${searchPath}`,
        vradArgs: `-PortalTraversalLighting -textureshadows -StaticPropLighting -StaticPropPolys -game ${searchPath}`,
        cubemapArgs: "-buildcubemaps -novid -windowed -w 800 -h 600 -condebug -bordered",
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
