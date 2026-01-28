import { SharedImageMetaReport } from "Shared/SharedImageMetaReport.js";
import { Reactive } from "vue";

export const AssetInspectorTextureInjectKey = Symbol() as InjectionKey<{
    meta: MaybeRefOrGetter<SharedImageMetaReport | undefined>;
}>;

export const AssetInspectorPanelsInjectKey = Symbol() as InjectionKey<{
    visiblePanels: Reactive<Map<string, boolean>>;
}>;
