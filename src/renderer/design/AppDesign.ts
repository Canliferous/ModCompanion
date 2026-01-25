import { SharedAssetType, SharedAssetTypes } from "Shared/SharedAssetDefinition.js";
import { SharedLaunchers } from "Shared/SharedLaunchers.js";
import { SharedLogType } from "Shared/SharedLogger.js";

export const Icons = {
    Asset: "mingcute:traffic-cone-fill",
    Material: "tdesign:highlight-1",
    Model: "mingcute:box-3-fill",
    Texture: "mingcute:pic-fill",

    Dot: "lucide:dot",
    Check: "mingcute:check-line",
    Loading: "mingcute:loading-line",
    Filter: "mingcute:filter-3-line",
    Search: "mingcute:search-2-line",
    CollapseVertical: "mingcute:fold-vertical-line",
    ExpandVertical: "mingcute:unfold-vertical-line",
    ChevronUp: "mingcute:up-line",
    ChevronDown: "mingcute:down-line",
    ChevronLeft: "mingcute:left-line",
    ChevronRight: "mingcute:right-line",
    ArrowUp: "mingcute:arrow-up-line",
    ArrowDown: "mingcute:arrow-down-line",
    ArrowLeft: "mingcute:arrow-left-line",
    ArrowRight: "mingcute:arrow-right-line",
    Ellipsis: "mingcute:more-1-line",
    EllipsisVertical: "mingcute:more-2-line",
    Home: "mingcute:home-3-fill",
    Close: "mingcute:close-line",
    Copy: "mingcute:copy-2-line",
    Bulb: "mingcute:bulb",
    Question: "mingcute:question-fill",
    NetworkConnected: "mingcute:wifi-line",
    NetworkDisconnected: "mingcute:wifi-off-line",

    Conversion: "mingcute:lightning-fill",

    FsFolder: "mingcute:folder-fill",
    FsFolderOpen: "mingcute:folder-open-fill",
    FsFile: "mingcute:file-fill",

    ActionAdd: "mingcute:add-line",
    ActionRemove: "mingcute:minimize-line",
    ActionSend: "mingcute:send-fill",

    ActionConvertAsset: "mingcute:large-arrow-right-fill",
    ActionCreateAsset: "mingcute:add-line",
    ActionCreateAssetGroup: "mingcute:new-folder-fill",
    ActionCompileMap: "mingcute:large-arrow-right-fill",

    ActionBrowseToFolder: "mingcute:folder-2-fill",
    ActionExploreToFolder: "mingcute:folder-2-fill",

    ActionMcaFile: "mingcute:file-star-fill",
    ActionExploreToMca: "mingcute:folder-star-fill",
    ActionBrowseToMca: "mingcute:folder-star-fill",
    ActionOpenFileMca: "mingcute:file-star-fill",

    ActionLaunchFile: "mingcute:play-fill",
    ActionEdit: "mingcute:edit-line",
    ActionEditPencil: "mingcute:edit-2-fill",
    ActionSelectCursor: "mingcute:cursor-fill",
    ActionDelete: "mingcute:delete-fill",

    ActionPlay: "mingcute:play-fill",
    ActionPause: "mingcute:pause-fill",
    ActionStop: "mingcute:stop-fill",

    ActionRefresh: "mingcute:refresh-3-line",
    ActionMinimize: "mingcute:minimize-fill",

    MapCompileIdle: "lucide:dot",
    MapCompileInProgress: "mingcute:loading-line",
    MapCompileCompleted: "mingcute:check-line",

    ConversionStateInvalid: "mingcute:alert-fill",
    ConversionStateUnknown: "mingcute:question-fill",
    ConversionStatePending: "lucide:dot",
    ConversionStateInProgress: "mingcute:loading-line",
    ConversionStateFinished: "mingcute:checks-line",
    ConversionStateFailed: "mingcute:close-line",
    ConversionStateNoChange: "mingcute:check-line",

    Panel_MapList: "mingcute:map-2-fill",
    Panel_MapCompileLog: "mingcute:list-check-fill",
    Panel_AssetBrowser: "mingcute:document-3-fill",
    Panel_FileBrowser: "mingcute:folder-open-fill",
    Panel_FileInspector: "mingcute:document-fill",
    Panel_AssetInspector: "mingcute:edit-4-fill",
    Panel_AssetInspector_TexturePreview: "mingcute:pic-fill",
    Panel_AssetInspector_TextureMetadata: "mingcute:layer-fill",
    Panel_AssetInspector_TextureConvert: "mingcute:settings-2-fill",
    Panel_AssetInspector_TextureChannels: "mingcute:layout-grid-fill",
    Panel_AssetInspector_TextureHotspotEditor: "mingcute:layout-9-line",
    Panel_AssetInspector_General: "mingcute:list-check-fill",
    Panel_Conversions: "mingcute:list-check-2-fill",
    Panel_ConversionDetails: "mingcute:lightning-fill",
    Panel_StrataConsole: "mingcute:terminal-fill",

    Log: "mingcute:list-check-fill",
    LogType_Debug: "mingcute:bug-fill",
    LogType_Info: "mingcute:information-fill",
    LogType_Warning: "mingcute:alert-fill",
    LogType_Error: "mingcute:alert-fill",
} as const;

export const BitmapIcon = {
    Launchers: {
        [SharedLaunchers.Game]: "revolution",
        [SharedLaunchers.Hammer]: "hammer",
        [SharedLaunchers.Faceposer]: "faceposer",
        [SharedLaunchers.Hlmv]: "hlmv",
    },
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

export function getLogTypeIcon(logType: SharedLogType) {
    switch (logType) {
        case SharedLogType.Debug: {
            return Icons.LogType_Debug;
        }
        case SharedLogType.Info: {
            return Icons.LogType_Info;
        }
        case SharedLogType.Warning: {
            return Icons.LogType_Warning;
        }
        case SharedLogType.Error: {
            return Icons.LogType_Error;
        }
    }
}

export function getLogTypeTextColor(logType: SharedLogType): string {
    switch (logType) {
        case SharedLogType.Debug: {
            return "text-magenta-400";
        }
        case SharedLogType.Info: {
            return "text-info-400";
        }
        case SharedLogType.Warning: {
            return "text-yellow-400";
        }
        case SharedLogType.Error: {
            return "text-red-400";
        }
    }
}

export function getLogTypeTextColorWarnings(logType: SharedLogType): string {
    switch (logType) {
        case SharedLogType.Debug:
        case SharedLogType.Info: {
            return "";
        }
        case SharedLogType.Warning: {
            return "text-yellow-400";
        }
        case SharedLogType.Error: {
            return "text-red-400";
        }
    }
}

export const AppDesign = {
    Icons,
    BitmapIcon,
};
