import { SharedImageMetaReport } from "Shared/SharedImageMetaReport.js";

export const AssetInspectorTextureInjectKey = Symbol() as InjectionKey<{
    meta: MaybeRefOrGetter<SharedImageMetaReport | undefined>;
}>;
