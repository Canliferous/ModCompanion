import { SharedVtfCreateOptions } from "Shared/vtf/SharedVtf.js";

export const AssetInspectorTextureConvertInjectKey = Symbol() as InjectionKey<{
    updateOptions: (op: Partial<SharedVtfCreateOptions>) => void;
}>;
