import pathe from "pathe";

export enum FileInspectors {
    Unknown,
    Text,
    Image,
    Model,
    Texture,
}

export enum FileType {
    Unknown,
    TextMca,
    TextVmt,
    TextGeneric,
    ImagePng,
    ImageJpg,
    Mdl,
    Vtf,
}

const FileTypeNames: Record<FileType, string> = {
    [FileType.Unknown]: "Unknown",
    [FileType.TextMca]: "Mod Companion Asset",
    [FileType.TextVmt]: "Material",
    [FileType.TextGeneric]: "Text",
    [FileType.ImagePng]: "PNG",
    [FileType.ImageJpg]: "JPG",
    [FileType.Mdl]: "Model Definition",
    [FileType.Vtf]: "Texture",
};

export function getFileTypeName(fileType: FileType): string {
    return FileTypeNames[fileType];
}

export function getFileType(fileName: string): FileType {
    const ext = pathe.extname(fileName);
    if (ext === ".mca") return FileType.TextMca;
    if (ext === ".txt") return FileType.TextGeneric;
    if (ext === ".vmt") return FileType.TextVmt;
    if (ext === ".png") return FileType.ImagePng;
    if (ext === ".jpg") return FileType.ImageJpg;
    if (ext === ".mdl") return FileType.Mdl;
    if (ext === ".vtf") return FileType.Vtf;

    return FileType.Unknown;
}

export function getFileInspectorFromType(fileType: FileType): FileInspectors {
    switch (fileType) {
        case FileType.TextGeneric:
        case FileType.TextVmt:
        case FileType.TextMca: {
            return FileInspectors.Text;
        }
        case FileType.ImagePng:
        case FileType.ImageJpg: {
            return FileInspectors.Image;
        }
        case FileType.Mdl: {
            return FileInspectors.Model;
        }
        case FileType.Vtf: {
            return FileInspectors.Texture;
        }
        case FileType.Unknown:
        default: {
            return FileInspectors.Unknown;
        }
    }
}
