export interface SharedTcArtifactsListAllMapsReportMap {
    objectKey: string;
    size: number;
    dateModified: Date;
}

export interface SharedTcArtifactsListAllMapsReport {
    maps: Map<string, SharedTcArtifactsListAllMapsReportMap[]>;
}
