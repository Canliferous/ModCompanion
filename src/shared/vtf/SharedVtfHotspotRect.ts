export interface SharedVtfHotspotRect {
    x0: number;
    y0: number;
    x1: number;
    y1: number;
    flags?: SharedVtfHotspotRectFlags;
}

export interface SharedVtfHotspotRectFlags {
    randomRotation?: boolean;
    randomReflection?: boolean;
    isAlternative?: boolean;
}

export function isVtfHotspotRectFlagsEqual(
    flags1: SharedVtfHotspotRectFlags | undefined,
    flags2: SharedVtfHotspotRectFlags | undefined,
): boolean {
    return (
        (flags1 === undefined) === (flags2 === undefined) &&
        flags1?.randomRotation === flags2?.randomRotation &&
        flags1?.randomReflection === flags2?.randomReflection &&
        flags1?.isAlternative === flags2?.isAlternative
    );
}
