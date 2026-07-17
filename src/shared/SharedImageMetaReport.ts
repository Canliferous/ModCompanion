export interface ImageMetaReportTag {
    value: string;
    description: string;
}

export interface ImageMetaReport {
    filePath: string;
    tags?: Record<string, ImageMetaReportTag>;
}
