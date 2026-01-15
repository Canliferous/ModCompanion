import pathe from "pathe";
import SharedConstants from "Shared/SharedConstants.js";

export enum FileType {
    Unknown = "Unknown File Type",
    Image = "Image File",
    Model = "Source Engine Model File",
}

export function getFileType(fileName: string): FileType {
    const ext = pathe.extname(fileName);
    if (SharedConstants.isTextureFileEnding(ext)) return FileType.Image;
    if (ext === ".mdl") return FileType.Model;

    return FileType.Unknown;
}
