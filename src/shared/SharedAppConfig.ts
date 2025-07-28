import { SharedVtfCreateOptions } from "./vtf/SharedVtf.js";

export interface SharedAppConfig {
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

    mapSourceDirs?: string[];
    assetDefaults?: {
        vtfOptions?: SharedVtfCreateOptions;
    };
}
