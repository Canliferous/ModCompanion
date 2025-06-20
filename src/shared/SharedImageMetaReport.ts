import { ColourspaceEnum } from "sharp";

export interface SharedImageMetaReport {
    filePath: string;
    format: string;
    width: number;
    height: number;
    fileSizeBytes?: number;
    bitDepth?: number;
    colorSpace?: keyof ColourspaceEnum;
}
