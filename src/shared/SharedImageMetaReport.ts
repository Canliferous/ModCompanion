import exifreader from "exifreader";

export interface SharedImageMetaReport {
    filePath: string;
    tags?: exifreader.Tags;
    data?: string;
}
