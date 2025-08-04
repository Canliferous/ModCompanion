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
    V2NoDepthBuffer: "V2_NO_DEPTH_BUFFER",
    V2ClampU: "V2_CLAMP_U",
    V3LoadAllMips: "V3_LOAD_ALL_MIPS",
    V3VertexTexture: "V3_VERTEX_TEXTURE",
    V3SSBump: "V3_SSBUMP",
    V3Border: "V3_BORDER",
    V4SRGB: "V4_SRGB",
    V4TF2StagingMemory: "V4_TF2_STAGING_MEMORY",
    V4TF2ImmediateCleanup: "V4_TF2_IMMEDIATE_CLEANUP",
    V4TF2IgnorePicMip: "V4_TF2_IGNORE_PICMIP",
    V4TF2StreamableCoarse: "V4_TF2_STREAMABLE_COARSE",
    V4TF2StreamableFine: "V4_TF2_STREAMABLE_FINE",
    V5PwlCorrected: "V5_PWL_CORRECTED",
    V5SRGB: "V5_SRGB",
    V5DefaultPool: "V5_DEFAULT_POOL",
    V5LoadMostMips: "V5_LOAD_MOST_MIPS",
    V5CsgoCombined: "V5_CSGO_COMBINED",
    V5CsgoAsyncDownload: "V5_CSGO_ASYNC_DOWNLOAD",
    V5CsgoSkipInitialDownload: "V5_CSGO_SKIP_INITIAL_DOWNLOAD",
    V5CsgoYCOCG: "V5_CSGO_YCOCG",
    V5CsgoAsyncSkipInitialLowRes: "V5_CSGO_ASYNC_SKIP_INITIAL_LOW_RES",
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
    [SharedVtfFlags.V2NoDepthBuffer, SharedVtfVersions.v74],
    [SharedVtfFlags.V2ClampU, SharedVtfVersions.v74],
    [SharedVtfFlags.V3LoadAllMips, SharedVtfVersions.v74],
    [SharedVtfFlags.V3VertexTexture, SharedVtfVersions.v74],
    [SharedVtfFlags.V3SSBump, SharedVtfVersions.v74],
    [SharedVtfFlags.V3Border, SharedVtfVersions.v74],
    [SharedVtfFlags.V4SRGB, SharedVtfVersions.v74],
    [SharedVtfFlags.V4TF2StagingMemory, SharedVtfVersions.v74],
    [SharedVtfFlags.V4TF2ImmediateCleanup, SharedVtfVersions.v74],
    [SharedVtfFlags.V4TF2IgnorePicMip, SharedVtfVersions.v74],
    [SharedVtfFlags.V4TF2StreamableCoarse, SharedVtfVersions.v74],
    [SharedVtfFlags.V4TF2StreamableFine, SharedVtfVersions.v74],
    [SharedVtfFlags.V5PwlCorrected, SharedVtfVersions.v75],
    [SharedVtfFlags.V5SRGB, SharedVtfVersions.v75],
    [SharedVtfFlags.V5DefaultPool, SharedVtfVersions.v75],
    [SharedVtfFlags.V5LoadMostMips, SharedVtfVersions.v75],
    [SharedVtfFlags.V5CsgoCombined, SharedVtfVersions.v75],
    [SharedVtfFlags.V5CsgoAsyncDownload, SharedVtfVersions.v75],
    [SharedVtfFlags.V5CsgoSkipInitialDownload, SharedVtfVersions.v75],
    [SharedVtfFlags.V5CsgoYCOCG, SharedVtfVersions.v75],
    [SharedVtfFlags.V5CsgoAsyncSkipInitialLowRes, SharedVtfVersions.v75],
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
