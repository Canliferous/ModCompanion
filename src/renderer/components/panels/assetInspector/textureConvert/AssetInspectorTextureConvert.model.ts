import { SharedVtfCreateOptions } from "Shared/SharedMareTf.js";

export const AssetInspectorTextureConvertInjectKey = Symbol() as InjectionKey<{
    updateOptions: (op: Partial<SharedVtfCreateOptions>) => void;
}>;
