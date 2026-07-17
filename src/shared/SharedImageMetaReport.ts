export interface ImageMetaReportTag {
    value: string | number;
    description: string;
}

export interface ImageMetaReport {
    filePath: string;
    tags?: Record<string, ImageMetaReportTag>;
}
