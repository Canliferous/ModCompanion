import { SharedVtfCreateOptions } from "./SharedVtf.js";
// import { S3ClientConfig } from "@aws-sdk/client-s3";
import { SharedMapPresets } from "./SharedMap.js";

export interface AppConfig {
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

    /**
     * Path to the materials content folder
     * Represents: <repo>/content/<search_path>/materialsrc
     * */
    textureSourcePath: string;

    /**
     * Path to the materials game folder
     * Represents: <repo>/game/<search_path>/materials
     * */
    textureOutputPath: string;

    /**
     * Path to the models content folder
     * Represents: <repo>/game/<search_path>/models
     * */
    modelSourcePath: string;

    /**
     * Path to the models game folder
     * Represents: <repo>/game/<search_path>/models
     * */
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

    /** Default search path. e.g. "revolution" */
    gameName: string;

    mapSourceDirs?: string[];
    mapPresets?: SharedMapPresets;

    assetDefaults?: {
        vtfOptions?: SharedVtfCreateOptions;
    };

    teamCityArtifactCloud?: any; //S3ClientConfig;
    teamCityArtifactCloudBucket?: string;
}
