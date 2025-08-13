import { SharedAssetType, SharedAssetTypes } from "Shared/SharedAssetDefinition.js";

export const icons = {
    asset: "tdesign:traffic-events-filled",
    material: "tdesign:highlight-1",
    model: "tdesign:control-platform",
    texture: "tdesign:image-filled",
} as const;

export const colors = {
    gameAsset: "amber",
    contentAsset: "lime",
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
