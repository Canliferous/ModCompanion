import { SharedVtfCreateOptions } from "./SharedMareTf.js";

export const SharedAssetDefinitionFileExtension = ".mca"; // Mod Companion Asset

export enum SharedAssetType {
    Unknown = "unknown",
    Texture = "texture",
    Model = "model",
}

export function isValidAssetType(str: string): str is SharedAssetType {
    return (Object.values(SharedAssetType) as string[]).includes(str);
}

export interface SharedAssetDefinitionFileArrays {
    readonly contentFiles?: string[];
    readonly gameFiles?: string[];
}

export interface SharedAssetDefinition extends SharedAssetDefinitionFileArrays {
    readonly id: string;
    readonly type: SharedAssetType;
    readonly displayName?: string;

    readonly associatedFiles?: SharedAssetDefinitionAssociatedFiles;
}

export interface SharedAssetDefinitionAssociatedFiles {
    substanceDesigner?: string;
    substancePainter?: string;
    blender?: string;
}

interface SharedAssetDefinitionAssociatedFilesEntry {
    field: keyof SharedAssetDefinitionAssociatedFiles;
    name: string;
}

export const SharedAssetDefinitionAssociatedFilesEntries: SharedAssetDefinitionAssociatedFilesEntry[] = [
    {
        field: "substanceDesigner",
        name: "Substance Designer",
    },
    {
        field: "substancePainter",
        name: "Substance Painter",
    },
    {
        field: "blender",
        name: "Blender",
    },
];

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

export type SharedAssetId = string;

export interface SharedAssetRescanEvent {
    assets: Map<SharedAssetId, SharedAsset>;
    totalTimeMillis?: number;
}

export interface SharedAssetAddedEvent {
    assets: SharedAsset[];
}

export interface SharedAssetUpdatedEvent {
    assets: SharedAsset[];
}

export type SharedAssetMap = Map<SharedAssetId, SharedAsset>;

export interface SharedTextureAssetDefinition extends SharedAssetDefinition {
    type: SharedAssetType.Texture;
    vtfOptions?: SharedVtfCreateOptions;
}

export function isTextureAssetDefinition(
    asset: SharedAssetDefinition | undefined,
): asset is SharedTextureAssetDefinition {
    return asset?.type === SharedAssetType.Texture;
}

export function isTextureAsset(asset: SharedAsset | undefined): asset is SharedTextureAsset {
    return isTextureAssetDefinition(asset?.def);
}
