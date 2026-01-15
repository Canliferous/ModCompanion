export interface SharedMdlInfoReport {
    general: {
        name: string;
        filename: string;
        id: string;
        version: string;
        checksum: string;
        eye_pos: string;
        illum_pos: string;
        hull_min: string;
        hull_max: string;
        bone_count: string;
        attachment_count: string;
        surfaceprop: string;
    };

    materials: string[];
    cdmaterials: string[];
    mdlkeyvalue: any;
}
