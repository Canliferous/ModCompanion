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

    FsFolder: "tdesign:folder-filled",
    FsFolderOpen: "tdesign:folder-open-1-filled",

    ActionAdd: "lucide:plus",
    ActionRemove: "lucide:minus",

    ActionConvertAsset: "lucide:arrow-big-right-dash",
    ActionCreateAsset: "lucide:plus",
    ActionCreateAssetGroup: "lucide:folder-plus",

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

    ConversionStateInvalid: "lucide:triangle-alert",
    ConversionStateUnknown: "lucide:circle-question-mark",
    ConversionStatePending: "lucide:dot",
    ConversionStateInProgress: "lucide:loading",
    ConversionStateFinished: "lucide:check",
    ConversionStateFailed: "lucide:x",
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
};
