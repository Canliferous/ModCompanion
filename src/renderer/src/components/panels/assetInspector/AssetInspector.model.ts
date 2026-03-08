import { Reactive } from "vue";
import * as Shared from "mod_companion_shared";

export const AssetInspectorTextureInjectKey = Symbol() as InjectionKey<{
    meta: MaybeRefOrGetter<Shared.ImageMeta.SharedImageMetaReport | undefined>;
}>;

export const AssetInspectorPanelsInjectKey = Symbol() as InjectionKey<{
    visiblePanels: Reactive<Map<string, boolean>>;
}>;
