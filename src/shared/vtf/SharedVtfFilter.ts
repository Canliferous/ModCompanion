export const SharedVtfFilters = {
    Default: "DEFAULT",
    Box: "BOX",
    Bilinear: "BILINEAR",
    CubicBSpline: "CUBIC_BSPLINE",
    CatmullRom: "CATMULL_ROM",
    Mitchell: "MITCHELL",
    PointSample: "POINT_SAMPLE",
    Kaiser: "KAISER",
    Nice: "NICE",
} as const;
export type SharedVtfFilter = (typeof SharedVtfFilters)[keyof typeof SharedVtfFilters];
export const SharedVtfDefaultFilter = SharedVtfFilters.Default;
