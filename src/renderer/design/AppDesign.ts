import { SharedAssetType, SharedAssetTypes } from "Shared/SharedAssetDefinition.js";

export const Icons = {
    Asset: "tdesign:traffic-events-filled",
    Material: "tdesign:highlight-1",
    Model: "lucide:box",
    Texture: "lucide:image",

    Dot: "lucide:dot",
    Check: "lucide:check",
    Loading: "lucide:loader-circle",
    Filter: "lucide:funnel",
    Search: "lucide:search",
    CollapseVertical: "lucide:chevrons-down-up",
    ExpandVertical: "lucide:chevrons-up-down",
    ChevronUp: "lucide:chevron-up",
    ChevronDown: "lucide:chevron-down",
    ChevronLeft: "lucide:chevron-left",
    ChevronRight: "lucide:chevron-right",
    ArrowUp: "lucide:arrow-up",
    ArrowDown: "lucide:arrow-down",
    ArrowLeft: "lucide:arrow-left",
    ArrowRight: "lucide:arrow-right",
    Ellipsis: "lucide:ellipsis",
    EllipsisVertical: "lucide:ellipsis-vertical",
    Home: "lucide:home",
    Close: "lucide:x",
    Copy: "lucide:copy",

    CheckmarkChecked: "lucide:square-check-big",
    CheckmarkUnchecked: "lucide:square",

    Conversion: "tdesign:arrow-left-right-3",

    FsFolder: "tdesign:folder-filled",
    FsFolderOpen: "tdesign:folder-open-1-filled",
    FsFile: "tdesign:file-filled",

    ActionAdd: "lucide:plus",
    ActionRemove: "lucide:minus",
    ActionSend: "lucide:send-horizontal",

    ActionConvertAsset: "lucide:arrow-big-right-dash",
    ActionCreateAsset: "lucide:plus",
    ActionCreateAssetGroup: "lucide:folder-plus",
    ActionCompileMap: "lucide:arrow-big-right-dash",

    ActionBrowseToFolder: "lucide:folder",
    ActionExploreToFolder: "lucide:folder",
    ActionOpenFileCode: "lucide:file",

    ActionMcaFile: "lucide:file-code",
    ActionExploreToMca: "lucide:folder-code",
    ActionBrowseToMca: "lucide:folder-code",
    ActionOpenFileMca: "lucide:file-code",

    ActionLaunchFile: "lucide:play",

    ActionPlay: "lucide:play",
    ActionPause: "lucide:pause",
    ActionStop: "lucide:stop",

    ActionRefresh: "lucide:refresh-cw",

    NewWorkspace: "lucide:heart",

    MapCompileIdle: "lucide:dot",
    MapCompileInProgress: "lucide:loading",
    MapCompileCompleted: "lucide:check",

    ConversionStateInvalid: "tdesign:error-triangle-filled",
    ConversionStateUnknown: "lucide:circle-question-mark",
    ConversionStatePending: "lucide:dot",
    ConversionStateInProgress: "lucide:loading",
    ConversionStateFinished: "lucide:check",
    ConversionStateFailed: "lucide:x",
} as const;

export const BitmapIcon = {
    Hammer: "hammer",
    Game: "revolution",
    Faceposer: "faceposer",
    Hlmv: "hlmv",
    ModCompanion: "mod_companion_192",
} as const;

export function getAssetTypeIcon(type: SharedAssetType): string {
    switch (type) {
        case SharedAssetTypes.Texture:
            return Icons.Texture;
        case SharedAssetTypes.Model:
            return Icons.Model;
        case SharedAssetTypes.Unknown:
        default:
            return Icons.Asset;
    }
}
export function getAssetTypeTextColor(type: SharedAssetType): string {
    switch (type) {
        case SharedAssetTypes.Texture:
            return "text-blue-400";
        case SharedAssetTypes.Model:
            return "text-pink-400";
        case SharedAssetTypes.Unknown:
        default:
            return "text-neutral-500";
    }
}

export function getAssetTypeName(type: SharedAssetType) {
    switch (type) {
        case SharedAssetTypes.Model: {
            return "Model";
        }
        case SharedAssetTypes.Texture: {
            return "Texture";
        }
        default:
        case SharedAssetTypes.Unknown: {
            return "Unknown";
        }
    }
}

export const AppDesign = {
    Icons,
    BitmapIcon,
};
