import { ColourspaceEnum } from "sharp";

export interface SharedImageMetaReport {
    filePath: string;
    format: string;
    width: number;
    height: number;
    fileSizeBytes?: number;
    bitDepth?: number;
    colorSpace?: keyof ColourspaceEnum;
    data?: string;
    channels?: SharedImageChannels;
}

export interface SharedImageChannels {
    redData?: string;
    greenData?: string;
    blueData?: string;
    alphaData?: string;
}
