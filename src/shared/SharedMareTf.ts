export enum SharedVtfVersion {
    v74 = "7.4",
    v75 = "7.5",
    v76 = "7.6",
}
export type SharedVtfFilter =
    | "DEFAULT"
    | "BOX"
    | "BILINEAR"
    | "CUBIC_BSPLINE"
    | "CATMULL_ROM"
    | "MITCHELL"
    | "POINT_SAMPLE"
    | "KAISER"
    | "NICE";
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
export type SharedVtfCompressionMethod = "DEFLATE" | "ZSTD" | "CONSOLE_LZMA";
export type SharedVtfImageFormat =
    | "UNCHANGED"
    | "DEFAULT"
    | "RGBA8888"
    | "ABGR8888"
    | "RGB888"
    | "BGR888"
    | "RGB565"
    | "I8"
    | "IA88"
    | "P8"
    | "A8"
    | "RGB888_BLUESCREEN"
    | "BGR888_BLUESCREEN"
    | "ARGB8888"
    | "BGRA8888"
    | "DXT1"
    | "DXT3"
    | "DXT5"
    | "BGRX8888"
    | "BGR565"
    | "BGRX5551"
    | "BGRA4444"
    | "DXT1_ONE_BIT_ALPHA"
    | "BGRA5551"
    | "UV88"
    | "UVWQ8888"
    | "RGBA16161616F"
    | "RGBA16161616"
    | "UVLX8888"
    | "R32F"
    | "RGB323232F"
    | "RGBA32323232F"
    | "RG1616F"
    | "RG3232F"
    | "RGBX8888"
    | "EMPTY"
    | "ATI2N"
    | "ATI1N"
    | "RGBA1010102"
    | "BGRA1010102"
    | "R16F"
    | "CONSOLE_BGRX8888_LINEAR"
    | "CONSOLE_RGBA8888_LINEAR"
    | "CONSOLE_ABGR8888_LINEAR"
    | "CONSOLE_ARGB8888_LINEAR"
    | "CONSOLE_BGRA8888_LINEAR"
    | "CONSOLE_RGB888_LINEAR"
    | "CONSOLE_BGR888_LINEAR"
    | "CONSOLE_BGRX5551_LINEAR"
    | "CONSOLE_I8_LINEAR"
    | "CONSOLE_RGBA16161616_LINEAR"
    | "CONSOLE_BGRX8888_LE"
    | "CONSOLE_BGRA8888_LE"
    | "R8"
    | "BC7"
    | "BC6H";

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
