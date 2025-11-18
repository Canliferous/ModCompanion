import { SharedVtfVersion, SharedVtfVersions } from "./SharedVtfVersion.js";
import { createGrouping, SharedVtfEnumGroup, SharedVtfEnumGrouping } from "./SharedVtfEnumGrouping.js";

export const SharedVtfFlags = {
    PointSample: "POINT_SAMPLE",
    Trilinear: "TRILINEAR",
    ClampS: "CLAMP_S",
    ClampT: "CLAMP_T",
    Anisotropic: "ANISOTROPIC",
    HintDXT5: "HINT_DXT5",
    Normal: "NORMAL",
    NoMip: "NO_MIP",
    NoLod: "NO_LOD",
    Procedural: "PROCEDURAL",
    OneBitAlpha: "ONE_BIT_ALPHA",
    MultiBitAlpha: "MULTI_BIT_ALPHA",
    Envmap: "ENVMAP",
    RenderTarget: "RENDERTARGET",
    DepthRenderTarget: "DEPTH_RENDERTARGET",
    NodeBugOverride: "NO_DEBUG_OVERRIDE",
    SingleCopy: "SINGLE_COPY",
    NoDepthBuffer: "NO_DEPTH_BUFFER",
    ClampU: "CLAMP_U",
    LoadAllMips: "LOAD_ALL_MIPS",
    VertexTexture: "VERTEX_TEXTURE",
    SSBump: "SSBUMP",
    Border: "BORDER",
    SRGB_V4: "SRGB_V4",
    TF2StagingMemory: "TF2_STAGING_MEMORY",
    TF2ImmediateCleanup: "TF2_IMMEDIATE_CLEANUP",
    TF2IgnorePicMip: "TF2_IGNORE_PICMIP",
    TF2StreamableCoarse: "TF2_STREAMABLE_COARSE",
    TF2StreamableFine: "TF2_STREAMABLE_FINE",
    PwlCorrected: "PWL_CORRECTED",
    SRGB_V5: "SRGB_V5",
    DefaultPool: "DEFAULT_POOL",
    LoadMostMips: "LOAD_MOST_MIPS",
    CsgoCombined: "CSGO_COMBINED",
    CsgoAsyncDownload: "CSGO_ASYNC_DOWNLOAD",
    CsgoSkipInitialDownload: "CSGO_SKIP_INITIAL_DOWNLOAD",
    CsgoYCOCG: "CSGO_YCOCG",
    CsgoAsyncSkipInitialLowRes: "CSGO_ASYNC_SKIP_INITIAL_LOW_RES",
} as const;
export type SharedVtfFlag = (typeof SharedVtfFlags)[keyof typeof SharedVtfFlags];

export const SharedVtfFlagVersionMap = new Map<SharedVtfFlag, SharedVtfVersion>([
    [SharedVtfFlags.PointSample, SharedVtfVersions.v74],
    [SharedVtfFlags.Trilinear, SharedVtfVersions.v74],
    [SharedVtfFlags.ClampS, SharedVtfVersions.v74],
    [SharedVtfFlags.ClampT, SharedVtfVersions.v74],
    [SharedVtfFlags.Anisotropic, SharedVtfVersions.v74],
    [SharedVtfFlags.HintDXT5, SharedVtfVersions.v74],
    [SharedVtfFlags.Normal, SharedVtfVersions.v74],
    [SharedVtfFlags.NoMip, SharedVtfVersions.v74],
    [SharedVtfFlags.NoLod, SharedVtfVersions.v74],
    [SharedVtfFlags.Procedural, SharedVtfVersions.v74],
    [SharedVtfFlags.OneBitAlpha, SharedVtfVersions.v74],
    [SharedVtfFlags.MultiBitAlpha, SharedVtfVersions.v74],
    [SharedVtfFlags.Envmap, SharedVtfVersions.v74],
    [SharedVtfFlags.RenderTarget, SharedVtfVersions.v74],
    [SharedVtfFlags.DepthRenderTarget, SharedVtfVersions.v74],
    [SharedVtfFlags.NodeBugOverride, SharedVtfVersions.v74],
    [SharedVtfFlags.SingleCopy, SharedVtfVersions.v74],
    [SharedVtfFlags.NoDepthBuffer, SharedVtfVersions.v74],
    [SharedVtfFlags.ClampU, SharedVtfVersions.v74],
    [SharedVtfFlags.LoadAllMips, SharedVtfVersions.v74],
    [SharedVtfFlags.VertexTexture, SharedVtfVersions.v74],
    [SharedVtfFlags.SSBump, SharedVtfVersions.v74],
    [SharedVtfFlags.Border, SharedVtfVersions.v74],
    [SharedVtfFlags.SRGB_V4, SharedVtfVersions.v74],
    [SharedVtfFlags.TF2StagingMemory, SharedVtfVersions.v74],
    [SharedVtfFlags.TF2ImmediateCleanup, SharedVtfVersions.v74],
    [SharedVtfFlags.TF2IgnorePicMip, SharedVtfVersions.v74],
    [SharedVtfFlags.TF2StreamableCoarse, SharedVtfVersions.v74],
    [SharedVtfFlags.TF2StreamableFine, SharedVtfVersions.v74],
    [SharedVtfFlags.PwlCorrected, SharedVtfVersions.v75],
    [SharedVtfFlags.SRGB_V5, SharedVtfVersions.v75],
    [SharedVtfFlags.DefaultPool, SharedVtfVersions.v75],
    [SharedVtfFlags.LoadMostMips, SharedVtfVersions.v75],
    [SharedVtfFlags.CsgoCombined, SharedVtfVersions.v75],
    [SharedVtfFlags.CsgoAsyncDownload, SharedVtfVersions.v75],
    [SharedVtfFlags.CsgoSkipInitialDownload, SharedVtfVersions.v75],
    [SharedVtfFlags.CsgoYCOCG, SharedVtfVersions.v75],
    [SharedVtfFlags.CsgoAsyncSkipInitialLowRes, SharedVtfVersions.v75],
]);

export const SharedVtfFlagDeprecated: SharedVtfFlag[] = [
    SharedVtfFlags.Trilinear,
    SharedVtfFlags.Anisotropic,
    SharedVtfFlags.PointSample,
];

export interface SharedVtfFlagGroup {
    label: string;
    flags: SharedVtfFlag[];
}
const SharedVtfFlagGroups: SharedVtfEnumGroup<SharedVtfFlag>[] = [
    {
        label: "Common Flags",
        items: [
            SharedVtfFlags.Normal,
            SharedVtfFlags.PointSample,
            SharedVtfFlags.Anisotropic,
            SharedVtfFlags.Trilinear,
            SharedVtfFlags.ClampS,
            SharedVtfFlags.ClampT,
        ],
    },
];

let grouping: SharedVtfEnumGrouping<SharedVtfFlag> | undefined;
export function getVtfFlagGrouping() {
    if (!grouping) {
        grouping = createGrouping(SharedVtfFlagGroups, Object.values(SharedVtfFlags));
    }

    return grouping;
}
