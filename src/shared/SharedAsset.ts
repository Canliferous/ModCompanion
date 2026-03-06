import { SharedVtfCreateOptions } from "./SharedVtf.js";

export const SharedAssetDefinitionFileExtension = ".mca"; // Mod Companion Asset

export const Types = {
    Unknown: "unknown",
    Texture: "texture",
    Model: "model",
} as const;
export type SharedAssetType = (typeof Types)[keyof typeof Types];

export function isValidAssetType(str: string): str is SharedAssetType {
    return (Object.values(Types) as string[]).includes(str);
}

export function getAssetTypeName(type: SharedAssetType): string {
    switch (type) {
        case Types.Texture: {
            return "Texture";
        }
        case Types.Model: {
            return "Model";
        }
        case Types.Unknown:
        default: {
            return "Unknown";
        }
    }
}

export const SharedAssetTypesValid = [Types.Texture, Types.Model];

export interface SharedAssetDefinitionFileArrays {
    readonly contentFiles?: string[];
    readonly gameFiles?: string[];
}

export interface SharedAssetDefinition extends SharedAssetDefinitionFileArrays {
    id: string;
    type: SharedAssetType;
    displayName?: string;

    associatedFiles?: SharedAssetDefinitionAssociatedFiles;
    credits?: string;
}

export interface SharedAssetDefinitionAssociatedFiles {
    substanceDesigner?: string;
    substancePainter?: string;
    blender?: string;
}

export interface SharedAssetDefinitionAssociatedFilesEntry {
    field: keyof SharedAssetDefinitionAssociatedFiles;
    name: string;
    icon: string;
}

export const SharedAssetDefinitionAssociatedFilesEntries: SharedAssetDefinitionAssociatedFilesEntry[] = [
    {
        field: "substanceDesigner",
        name: "Substance Designer",
        icon: "substance:designer",
    },
    {
        field: "substancePainter",
        name: "Substance Painter",
        icon: "substance:painter",
    },
    {
        field: "blender",
        name: "Blender",
        icon: "file-icons:blender",
    },
];

export function getAssociatedEntryName(field: keyof SharedAssetDefinitionAssociatedFiles) {
    return SharedAssetDefinitionAssociatedFilesEntries.find((value) => value.field === field);
}

export interface SharedAsset {
    /** Asset definition data read from the mca file */
    readonly def: SharedAssetDefinition;

    /** Path to the mca file */
    readonly defFilePath?: string;
}

export interface SharedTextureAsset extends SharedAsset {
    /** @inheritDoc */
    readonly def: SharedTextureAssetDefinition;
}

export type AssetId = string;

export interface SharedAssetRescanEvent {
    assets: Map<AssetId, SharedAsset>;
    potentialAssets: SharedAsset[];
    totalTimeMillis?: number;
}

export interface SharedAssetAddedEvent {
    assets: SharedAsset[];
}

export interface SharedAssetUpdatedEvent {
    assets: SharedAsset[];
}

export type SharedAssetMap = Map<AssetId, SharedAsset>;

export interface SharedTextureAssetDefinition extends SharedAssetDefinition {
    type: typeof Types.Texture;
    vtfOptions?: SharedVtfCreateOptions;
}

export function isTextureAssetDefinition(
    asset: SharedAssetDefinition | undefined,
): asset is SharedTextureAssetDefinition {
    return asset?.type === Types.Texture;
}

export function isTextureAsset(asset: SharedAsset | undefined): asset is SharedTextureAsset {
    return isTextureAssetDefinition(asset?.def);
}

export interface SharedModelAssetDefinition extends SharedAssetDefinition {
    type: typeof Types.Model;
}

export function isModelAssetDefinition(asset: SharedAssetDefinition | undefined): asset is SharedModelAssetDefinition {
    return asset?.type === Types.Model;
}

// ------------------------

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
    asset: AssetId;
}

interface Success extends BaseSharedCreateAssetReport {
    type: SharedCreateAssetReportType.Success;
    assets: SharedAsset[];
}

export type SharedCreateAssetReport = UnknownError | FilesAlreadyUsedInAssetError | Success;
