import * as Shared from "mod_companion_shared";

export const AssetInspectorTextureConvertInjectKey = Symbol() as InjectionKey<{
    updateOptions: (op: Partial<Shared.Vtf.SharedVtfCreateOptions>) => void;
}>;
