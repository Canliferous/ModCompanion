import { SharedAsset, SharedAssetId } from "./SharedAssetDefinition.js";

export enum SharedCreateAssetReportType {
    ErrorUnknown,
    ErrorFileAlreadyUsedInAsset,
    Success,
}

interface BaseSharedCreateAssetReport {
    type: SharedCreateAssetReportType;
}

interface UnknownError extends BaseSharedCreateAssetReport {
    type: SharedCreateAssetReportType.ErrorUnknown;
}

interface FilesAlreadyUsedInAssetError extends BaseSharedCreateAssetReport {
    type: SharedCreateAssetReportType.ErrorFileAlreadyUsedInAsset;
    filesAlreadyUsed: string[];
    asset: SharedAssetId;
}

interface Success extends BaseSharedCreateAssetReport {
    type: SharedCreateAssetReportType.Success;
    asset: SharedAsset;
}

export type SharedCreateAssetReport = UnknownError | FilesAlreadyUsedInAssetError | Success;
