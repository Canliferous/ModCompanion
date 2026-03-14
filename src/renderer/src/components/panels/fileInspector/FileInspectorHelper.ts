import pathe from "pathe";
import FileInspectorModelPreview from "~/components/panels/fileInspector/FileInspectorModelPreview.vue";
import FileInspectorImagePreview from "~/components/panels/fileInspector/FileInspectorImagePreview.vue";
import { DefineComponent } from "vue";
import FileInspectorTextPreview from "~/components/panels/fileInspector/FileInspectorTextPreview.vue";
import FileInspectorMapPreview from "~/components/panels/fileInspector/FileInspectorMapPreview.vue";

export enum FileInspectors {
    Unknown,
    Text,
    Image,
    Model,
    Texture,
    Map,
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
    Vmf,
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
    [FileType.Vmf]: "Hammer Map",
};

export function getFileTypeName(fileType: FileType): string {
    return FileTypeNames[fileType];
}

export function getFileType(fileName: string): FileType {
    const ext = pathe.extname(fileName);
    if (ext === ".mca") return FileType.TextMca;

    if (ext === ".txt") return FileType.TextGeneric;
    if (ext === ".kv") return FileType.TextGeneric;
    if (ext === ".vdf") return FileType.TextGeneric;
    if (ext === ".vcd") return FileType.TextGeneric; // Todo: Add file preview for scenes with button to open in faceposer
    if (ext === ".json") return FileType.TextGeneric;
    if (ext === ".yml") return FileType.TextGeneric;
    if (ext === ".log") return FileType.TextGeneric;
    if (ext === ".bat") return FileType.TextGeneric;
    if (ext === ".sh") return FileType.TextGeneric;
    if (ext === ".md") return FileType.TextGeneric;
    if (ext === ".fgd") return FileType.TextGeneric;
    if (ext === ".inf") return FileType.TextGeneric;
    if (ext === ".rad") return FileType.TextGeneric;
    if (ext === ".nut") return FileType.TextGeneric;
    if (ext === ".res") return FileType.TextGeneric;
    if (ext === ".cfg") return FileType.TextGeneric;
    if (ext === ".js") return FileType.TextGeneric;
    if (ext === ".xml") return FileType.TextGeneric;
    if (ext === ".html") return FileType.TextGeneric;
    if (ext === ".css") return FileType.TextGeneric;
    if (ext === ".scss") return FileType.TextGeneric;

    if (ext === ".vmt") return FileType.TextVmt;
    if (ext === ".png") return FileType.ImagePng;
    if (ext === ".jpg") return FileType.ImageJpg;
    if (ext === ".mdl") return FileType.Mdl;
    if (ext === ".vtf") return FileType.Vtf;
    if (ext === ".vmf") return FileType.Vmf;

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
        case FileType.Vmf: {
            return FileInspectors.Map;
        }
        case FileType.Unknown:
        default: {
            return FileInspectors.Unknown;
        }
    }
}

export type FileInspectorComponent = DefineComponent<{ path: string }, any, any>;

export function getFileInspectorComponent(inspector: FileInspectors): FileInspectorComponent | undefined {
    switch (inspector) {
        case FileInspectors.Text:
            return FileInspectorTextPreview;
        case FileInspectors.Image:
            return FileInspectorImagePreview;
        case FileInspectors.Model:
            return FileInspectorModelPreview;
        case FileInspectors.Map:
            return FileInspectorMapPreview;
        default:
        case FileInspectors.Unknown:
            return undefined;
    }
}
