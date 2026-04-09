import { Reactive } from "vue";
import * as Shared from "mod_companion_shared";
import { useAssetListStore } from "~/store/AssetListStore.js";
import { AppDesign } from "~/design/AppDesign.js";
import { PanelBehavior, PanelModel } from "~/helper/GlobalComponents.js";

export interface AssetInspectorModel extends PanelModel {
    assetId: Shared.Asset.AssetId;
}

export const AssetInspectorBehavior = {
    TextureInjectKey: Symbol() as InjectionKey<{
        meta: MaybeRefOrGetter<Shared.ImageMeta.SharedImageMetaReport | undefined>;
    }>,
    PanelsInjectKey: Symbol() as InjectionKey<{
        visiblePanels: Reactive<Map<string, boolean>>;
    }>,
    getTitle(model: AssetInspectorModel | undefined): string {
        if (!model) {
            return "Asset Inspector";
        }
        const assetName = useAssetListStore().getAssetById(model.assetId)?.def.displayName ?? "(unknown)";
        return "Asset " + assetName;
    },
    getIcon(model: AssetInspectorModel | undefined): string {
        return AppDesign.Icons.Panel_AssetInspector;
    },
} satisfies PanelBehavior<AssetInspectorModel>;
