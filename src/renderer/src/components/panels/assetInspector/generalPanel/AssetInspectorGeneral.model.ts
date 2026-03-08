import { SharedAssetDefinition } from "Shared/SharedAssetDefinition.js";

export const AssetInspectorGeneralInjectKey = Symbol() as InjectionKey<{
    waiting: Ref<boolean>;
    updateAsset: (def: Partial<SharedAssetDefinition>) => Promise<void>;
}>;
