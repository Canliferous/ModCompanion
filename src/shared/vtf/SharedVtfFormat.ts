import { createGrouping, SharedVtfEnumGroup, SharedVtfEnumGrouping } from "./SharedVtfEnumGrouping.js";

export const SharedVtfImageFormats = {
    Unchanged: "UNCHANGED",
    Default: "DEFAULT",
    RGBA8888: "RGBA8888",
    ABGR8888: "ABGR8888",
    RGB888: "RGB888",
    BGR888: "BGR888",
    RGB565: "RGB565",
    I8: "I8",
    IA88: "IA88",
    P8: "P8",
    A8: "A8",
    RGB888Bluescreen: "RGB888_BLUESCREEN",
    BGR888Bluescreen: "BGR888_BLUESCREEN",
    ARGB8888: "ARGB8888",
    BGRA8888: "BGRA8888",
    DXT1: "DXT1",
    DXT3: "DXT3",
    DXT5: "DXT5",
    BGRX8888: "BGRX8888",
    BGR565: "BGR565",
    BGRX5551: "BGRX5551",
    BGRA4444: "BGRA4444",
    DXT1OneBitAlpha: "DXT1_ONE_BIT_ALPHA",
    BGRA5551: "BGRA5551",
    UV88: "UV88",
    UVWQ8888: "UVWQ8888",
    RGBA16161616F: "RGBA16161616F",
    RGBA16161616: "RGBA16161616",
    UVLX8888: "UVLX8888",
    R32F: "R32F",
    RGB323232F: "RGB323232F",
    RGBA32323232F: "RGBA32323232F",
    RG1616F: "RG1616F",
    RG3232F: "RG3232F",
    RGBX8888: "RGBX8888",
    // empty: "EMPTY",
    ATI2N: "ATI2N",
    ATI1N: "ATI1N",
    RGBA1010102: "RGBA1010102",
    BGRA1010102: "BGRA1010102",
    R16F: "R16F",
    // consolebgrx8888LINEAR: "CONSOLE_BGRX8888_LINEAR",
    // consolergba8888LINEAR: "CONSOLE_RGBA8888_LINEAR",
    // consoleabgr8888LINEAR: "CONSOLE_ABGR8888_LINEAR",
    // consoleargb8888LINEAR: "CONSOLE_ARGB8888_LINEAR",
    // consolebgra8888LINEAR: "CONSOLE_BGRA8888_LINEAR",
    // consolergb888LINEAR: "CONSOLE_RGB888_LINEAR",
    // consolebgr888LINEAR: "CONSOLE_BGR888_LINEAR",
    // consolebgrx5551LINEAR: "CONSOLE_BGRX5551_LINEAR",
    // consolei8LINEAR: "CONSOLE_I8_LINEAR",
    // consolergba16161616LINEAR: "CONSOLE_RGBA16161616_LINEAR",
    // consolebgrx8888LE: "CONSOLE_BGRX8888_LE",
    // consolebgra8888LE: "CONSOLE_BGRA8888_LE",
    R8: "R8",
    BC7: "BC7",
    BC6H: "BC6H",
} as const;
export type SharedVtfImageFormat = (typeof SharedVtfImageFormats)[keyof typeof SharedVtfImageFormats];
export const SharedVtfDefaultImageFormat = SharedVtfImageFormats.BC7;

const SharedVtfImageFormatGroups: SharedVtfEnumGroup<SharedVtfImageFormat>[] = [
    {
        label: "Common",
        items: ["BC7", "BC6H", "RGB888", "RGBA8888", "RGBA16161616", "RGBA16161616F", "RGBA32323232F"],
    },
    {
        label: "Special",
        items: ["DEFAULT", "UNCHANGED"],
    },
    {
        label: "Single Channel",
        items: ["R8", "R16F", "R32F", "I8", "P8", "A8"],
    },
    {
        label: "DXT",
        items: ["DXT1", "DXT1_ONE_BIT_ALPHA", "DXT3", "DXT5"],
    },
    {
        label: "Bluescreen",
        items: ["RGB888_BLUESCREEN", "BGR888_BLUESCREEN"],
    },
] as const;

let grouping: SharedVtfEnumGrouping<SharedVtfImageFormat> | undefined;
export function getVtfImageFormatGrouping() {
    if (!grouping) {
        grouping = createGrouping(SharedVtfImageFormatGroups, Object.values(SharedVtfImageFormats));
    }

    return grouping;
}

export function getVtfFormatName(format: SharedVtfImageFormat): string {
    switch (format) {
        case SharedVtfImageFormats.BGR888Bluescreen:
            return "BGR888 Bluescreen";
        case SharedVtfImageFormats.RGB888Bluescreen:
            return "RGB888 Bluescreen";
        case SharedVtfImageFormats.DXT1OneBitAlpha:
            return "DXT1 One Bit Alpha";
        case SharedVtfImageFormats.Unchanged:
            return "Infer from source file";
        case SharedVtfImageFormats.Default:
            return "Auto";
        default:
            return format;
    }
}
