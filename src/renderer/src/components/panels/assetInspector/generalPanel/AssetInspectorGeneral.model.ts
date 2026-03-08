import * as Shared from "mod_companion_shared";

export const AssetInspectorGeneralInjectKey = Symbol() as InjectionKey<{
    waiting: Ref<boolean>;
    updateAsset: (def: Partial<Shared.Asset.SharedAssetDefinition>) => Promise<void>;
}>;
