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

export function getVtfFilterName(version: SharedVtfFilter): string {
    switch (version) {
        case SharedVtfFilters.Default:
            return "Auto";
        case SharedVtfFilters.Box:
            return "Box";
        case SharedVtfFilters.Bilinear:
            return "Bilinear";
        case SharedVtfFilters.CubicBSpline:
            return "Cubic B-Spline";
        case SharedVtfFilters.CatmullRom:
            return "Catmull Rom";
        case SharedVtfFilters.Mitchell:
            return "Mitchell";
        case SharedVtfFilters.PointSample:
            return "Point Sample";
        case SharedVtfFilters.Kaiser:
            return "Kaiser";
        case SharedVtfFilters.Nice:
            return "Nice";
        default:
            return version;
    }
}
