export const SharedVtfVersions = {
    v74: "7.4",
    v75: "7.5",
    v76: "7.6",
} as const;
export type SharedVtfVersion = (typeof SharedVtfVersions)[keyof typeof SharedVtfVersions];
export const SharedVtfDefaultVersion = SharedVtfVersions.v76;
export function getVtfVersionName(version: SharedVtfVersion): string {
    switch (version) {
        case SharedVtfVersions.v74:
            return "7.4 (Orange Box)";
        case SharedVtfVersions.v75:
            return "7.5 (Alien Swarm)";
        case SharedVtfVersions.v76:
            return "7.6 (Strata)";
        default:
            return version;
    }
}

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

export type SharedVtfFlag =
    | "POINT_SAMPLE"
    | "TRILINEAR"
    | "CLAMP_S"
    | "CLAMP_T"
    | "ANISOTROPIC"
    | "HINT_DXT5"
    | "NORMAL"
    | "NO_MIP"
    | "NO_LOD"
    | "PROCEDURAL"
    | "ONE_BIT_ALPHA"
    | "MULTI_BIT_ALPHA"
    | "ENVMAP"
    | "RENDERTARGET"
    | "DEPTH_RENDERTARGET"
    | "NO_DEBUG_OVERRIDE"
    | "SINGLE_COPY"
    | "V2_NO_DEPTH_BUFFER"
    | "V2_CLAMP_U"
    | "V3_LOAD_ALL_MIPS"
    | "V3_VERTEX_TEXTURE"
    | "V3_SSBUMP"
    | "V3_BORDER"
    | "V4_SRGB"
    | "V4_TF2_STAGING_MEMORY"
    | "V4_TF2_IMMEDIATE_CLEANUP"
    | "V4_TF2_IGNORE_PICMIP"
    | "V4_TF2_STREAMABLE_COARSE"
    | "V4_TF2_STREAMABLE_FINE"
    | "V5_PWL_CORRECTED"
    | "V5_SRGB"
    | "V5_DEFAULT_POOL"
    | "V5_LOAD_MOST_MIPS"
    | "V5_CSGO_COMBINED"
    | "V5_CSGO_ASYNC_DOWNLOAD"
    | "V5_CSGO_SKIP_INITIAL_DOWNLOAD"
    | "V5_CSGO_YCOCG"
    | "V5_CSGO_ASYNC_SKIP_INITIAL_LOW_RES";

export const SharedVtfCompressionMethods = {
    Deflate: "DEFLATE",
    Zstd: "ZSTD",
    ConsoleLzma: "CONSOLE_LZMA",
} as const;
export type SharedVtfCompressionMethod = (typeof SharedVtfCompressionMethods)[keyof typeof SharedVtfCompressionMethods];
export const SharedVtfDefaultCompression = SharedVtfCompressionMethods.Deflate;

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

export interface SharedVtfCreateOptions {
    version?: SharedVtfVersion;
    format?: SharedVtfImageFormat;
    filter?: SharedVtfFilter;
    flags?: SharedVtfFlag[];
    noMips?: boolean;
    noAnimation?: boolean;
    noThumbnail?: boolean;
    compressionMethod?: SharedVtfCompressionMethod;
    compressionLevel?: number;
    bumpScale?: number;
    gammaCorrect?: boolean;

    /**
     * Default: 2.2. This is a string and not a number because of floating point precision
     */
    gammaCorrectAmount?: string;
}

export type SharedVtfCreateEnumOptions =
    | typeof SharedVtfVersions
    | typeof SharedVtfImageFormats
    | typeof SharedVtfFilters
    | typeof SharedVtfCompressionMethods;

export function buildMareTfCreateArgs(options: SharedVtfCreateOptions): string {
    let a = "";

    if (options.version) {
        a += ` --version ${options.version}`;
    }
    if (options.flags) {
        for (let flags of options.flags) {
            a += ` --flag ${flags}`;
        }
    }
    if (options.format) {
        a += ` --format ${options.format}`;
    }
    if (options.filter) {
        a += ` --filter ${options.filter}`;
    }
    if (options.noMips) {
        a += ` --no-mips`;
    }
    if (options.noAnimation) {
        a += ` --no-animation`;
    }
    if (options.noThumbnail) {
        a += ` --no-thumbnail`;
    }
    if (options.compressionMethod) {
        a += ` --compression-method ${options.compressionMethod}`;
    }
    if (options.compressionLevel) {
        a += ` --compression-level ${options.compressionLevel}`;
    }
    if (options.bumpScale) {
        a += ` --bump-scale`;
    }
    if (options.gammaCorrect) {
        a += ` --gamma-correct`;
    }
    if (options.gammaCorrectAmount) {
        a += ` --gamma-correct-amount ${options.gammaCorrectAmount}`;
    }

    return a;
}
