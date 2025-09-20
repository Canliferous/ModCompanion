import { SharedAssetType, SharedAssetTypes } from "Shared/SharedAssetDefinition.js";

export const icons = {
    asset: "tdesign:traffic-events-filled",
    material: "tdesign:highlight-1",
    model: "tdesign:control-platform-filled",
    texture: "tdesign:image-filled",
    assetGroup: "tdesign:combination-filled",
} as const;

export function getAssetTypeIcon(type: SharedAssetType): string {
    switch (type) {
        case SharedAssetTypes.Texture:
            return icons.texture;
        case SharedAssetTypes.Model:
            return icons.model;
        case SharedAssetTypes.Unknown:
        default:
            return icons.asset;
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

export default {
    icons,
};
