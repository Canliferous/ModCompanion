export interface SharedVtfHotspotRect {
    x0: number;
    y0: number;
    x1: number;
    y1: number;
    flags?: SharedVtfHotspotFlag[];
}

export const SharedVtfHotspotFlags = {
    RandomRotation: "RANDOM_ROTATION",
    RandomReflection: "RANDOM_REFLECTION",
    IsAlternate: "IS_ALTERNATE",
} as const;
export type SharedVtfHotspotFlag = (typeof SharedVtfHotspotFlags)[keyof typeof SharedVtfHotspotFlags];
