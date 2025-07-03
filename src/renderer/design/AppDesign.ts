import { SharedAssetType } from "Shared/SharedAssetDefinition.js";

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

export function getIconForAssetType(type: SharedAssetType): string {
    switch (type) {
        case SharedAssetType.Texture:
            return icons.texture;
        case SharedAssetType.Model:
            return icons.model;
        case SharedAssetType.Unknown:
        default:
            return icons.asset;
    }
}

export default {
    icons,
};
