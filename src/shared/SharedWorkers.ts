import { AppConfig } from "./SharedAppConfig.js";
import { FileEntry } from "./SharedFileBrowser.js";
import { ImageMetaReport } from "./SharedImageMetaReport.js";
import { AssetMap } from "./SharedAsset.js";

export enum WorkerFile {
    ImageMeta = "CoreImageMetaWorker",
    IndexFilesystem = "CoreIndexFilesystemWorker",
    AssetScanner = "CoreAssetScannerWorker",
}

export interface ImageMetaWorkerArgs {
    filePath: string;
}

export interface IndexFilesystemWorkerArgs {
    startDir: string;
}

export interface AssetScannerWorkerArgs {
    index: Map<string, FileEntry[]>;
}

export type WorkerArgs = {
    [WorkerFile.ImageMeta]: ImageMetaWorkerArgs;
    [WorkerFile.IndexFilesystem]: IndexFilesystemWorkerArgs;
    [WorkerFile.AssetScanner]: AssetScannerWorkerArgs;
};

export type WorkerResults = {
    [WorkerFile.ImageMeta]: ImageMetaReport;
    [WorkerFile.IndexFilesystem]: undefined;
    [WorkerFile.AssetScanner]: AssetMap;
};

export interface AppWorkerData<T> {
    args: T;
    common: {
        appConfig: AppConfig;
    };
}
