import { SharedVtfCreateOptions } from "./vtf/SharedVtf.js";
import { S3ClientConfig } from "@aws-sdk/client-s3";
import { SharedMapPresets } from "./SharedMapPreset.js";

export interface SharedAppConfig {
    /**
     * Path of the repo root directory
     * Represents: <repo>/
     * */
    rootPath: string;

    /**
     * Path of the content folder in the repo with the search path appended
     * Represents: <repo>/content/<search_path>
     * */
    contentPath: string;

    /**
     * Path of the game folder in the repo with the search path appended
     * Represents: <repo>/game/<search_path>
     * */
    gamePath: string;

    /**
     * Path of the game folder in the repo
     * Represents: <repo>/game
     * */
    gameRootPath: string;

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

    chamberSignConfigJson: string;

    gameName: string;

    mapSourceDirs?: string[];
    mapPresets?: SharedMapPresets;

    assetDefaults?: {
        vtfOptions?: SharedVtfCreateOptions;
    };

    teamCityArtifactCloud?: S3ClientConfig;
    teamCityArtifactCloudBucket?: string;
}
