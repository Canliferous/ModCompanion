import { AppConfig } from "./SharedAppConfig.js";
import { FileEntry, FileIndexMessage } from "./SharedFileBrowser.js";
import { ImageMetaReport } from "./SharedImageMetaReport.js";
import { AssetMap } from "./SharedAsset.js";
import * as Shared from "./SharedManifest.js";

export enum WorkerFile {
    ImageMeta = "CoreImageMetaWorker",
    IndexFilesystem = "CoreIndexFilesystemWorker",
    AssetScanner = "CoreAssetScannerWorker",
}

export enum MessageType {
    Log,
    Done,
    Post,
}

export interface WorkerMessage<TType extends MessageType, TPayload> {
    type: TType;
    payload: TPayload;
}

export type WorkerMessageLog = WorkerMessage<MessageType.Log, Shared.Log.Event>;
export type WorkerMessageDone<TPayload> = WorkerMessage<MessageType.Done, TPayload>;
export type WorkerMessagePost<TPayload> = WorkerMessage<MessageType.Post, TPayload>;

export interface AppWorkerMessages<TDonePayload, TPostPayload> {
    log: {
        debug: (channel: Shared.Log.Channel, ...data: any[]) => void;
        info: (channel: Shared.Log.Channel, ...data: any[]) => void;
        warning: (channel: Shared.Log.Channel, ...data: any[]) => void;
        error: (channel: Shared.Log.Channel, ...data: any[]) => void;
    };
    done: (doneData: TDonePayload) => void;
    post: (postData: TPostPayload) => void;
}

export interface ImageMetaWorkerArgs {
    filePath: string;
}

export type ImageMetaWorkerDoneMessage = ImageMetaReport | undefined;
export interface ImageMetaWorkerPostMessage {}

export interface IndexFilesystemWorkerArgs {
    startDir: string;
}

export interface IndexFilesystemWorkerDoneMessage {}
export type IndexFilesystemWorkerPostMessage = FileIndexMessage;

export interface AssetScannerWorkerArgs {
    index: Map<string, FileEntry[]>;
}

export type AssetScannerWorkerDoneMessage = AssetMap;
export interface AssetScannerWorkerPostMessage {
    progressNorm: number;
}

export type WorkerArgs = {
    [WorkerFile.ImageMeta]: ImageMetaWorkerArgs;
    [WorkerFile.IndexFilesystem]: IndexFilesystemWorkerArgs;
    [WorkerFile.AssetScanner]: AssetScannerWorkerArgs;
};

export type WorkerDoneMessages = {
    [WorkerFile.ImageMeta]: ImageMetaWorkerDoneMessage;
    [WorkerFile.IndexFilesystem]: IndexFilesystemWorkerDoneMessage;
    [WorkerFile.AssetScanner]: AssetScannerWorkerDoneMessage;
};

export type WorkerPostMessages = {
    [WorkerFile.ImageMeta]: ImageMetaWorkerPostMessage;
    [WorkerFile.IndexFilesystem]: IndexFilesystemWorkerPostMessage;
    [WorkerFile.AssetScanner]: AssetScannerWorkerPostMessage;
};

export interface AppWorkerData<TArgs> {
    args: TArgs;
    common: {
        appConfig: AppConfig;
    };
}
