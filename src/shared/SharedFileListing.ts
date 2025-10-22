export interface SharedProjectFileEntry {
    name: string;
    path: string;
    isFile: boolean;
    fileSize?: number;
}

export const SharedProjectListFilesReportTypes = {
    Success: 0,
    Invalid: 1,
} as const;
export type SharedProjectListFilesReportType =
    (typeof SharedProjectListFilesReportTypes)[keyof typeof SharedProjectListFilesReportTypes];

interface SharedProjectListFilesReportBase {
    type: SharedProjectListFilesReportType;
}

export interface SharedProjectListFilesReportSuccess extends SharedProjectListFilesReportBase {
    type: typeof SharedProjectListFilesReportTypes.Success;
    entries?: SharedProjectFileEntry[];
}
export interface SharedProjectListFilesReportInvalid extends SharedProjectListFilesReportBase {
    type: typeof SharedProjectListFilesReportTypes.Invalid;
}

export type SharedProjectListFilesReport = SharedProjectListFilesReportSuccess | SharedProjectListFilesReportInvalid;
