import { SharedVtfCreateOptions } from "Shared/SharedVtf.js";

export const AssetInspectorTextureConvertInjectKey = Symbol() as InjectionKey<{
    updateOptions: (op: Partial<SharedVtfCreateOptions>) => void;
}>;
