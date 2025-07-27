<template>
    <div class="grid grid-cols-2 p-2 gap-2">
        <UFormField label="Version">
            <EnumSelectBig
                :enum="SharedVtfVersions"
                :options="options"
                field="version"
                :default="SharedVtfDefaultVersion"
                :label-func="getVtfVersionName"
            />
        </UFormField>
        <UFormField label="Format">
            <EnumSelectBig
                :enum="SharedVtfImageFormats"
                :options="options"
                field="format"
                :default="SharedVtfDefaultImageFormat"
                :columns="3"
            />
        </UFormField>
        <UFormField label="Filter">
            <EnumSelectBig
                :enum="SharedVtfFilters"
                :options="options"
                field="filter"
                :default="SharedVtfDefaultFilter"
            />
        </UFormField>
        <UFormField label="Compression Method">
            <EnumSelectBig
                :enum="SharedVtfCompressionMethods"
                :options="options"
                field="compressionMethod"
                :default="SharedVtfDefaultCompression"
            />
        </UFormField>
        <UFormField label="Toggles" class="col-span-full">
            <div class="grid grid-cols-2 gap-2">
                <AssetInspectorTextureConvertToggles :options="options" />
            </div>
        </UFormField>
    </div>
</template>

<script setup lang="ts">
import { SharedAsset, SharedTextureAsset, SharedTextureAssetDefinition } from "Shared/SharedAssetDefinition.js";
import {
    getVtfVersionName,
    SharedVtfCompressionMethods,
    SharedVtfCreateOptions,
    SharedVtfDefaultCompression,
    SharedVtfDefaultFilter,
    SharedVtfDefaultImageFormat,
    SharedVtfDefaultVersion,
    SharedVtfFilters,
    SharedVtfImageFormats,
    SharedVtfVersions,
} from "Shared/SharedMareTf.js";
import { getAppConfig } from "~/renderer-config.js";
import { AssetInspectorTextureConvertInjectKey } from "~/components/panels/assetInspector/textureConvert/AssetInspectorTextureConvert.model.js";
import { useAssetListStore } from "~/store/AssetListStore.js";
import AssetInspectorTextureConvertToggles from "~/components/panels/assetInspector/textureConvert/AssetInspectorTextureConvertToggles.vue";

const props = defineProps<{ asset: SharedTextureAsset }>();

const options = ref<SharedVtfCreateOptions>({
    ...getAppConfig().assetDefaults?.vtfOptions,
    ...props.asset.def.vtfOptions,
});
watch(
    () => props.asset.def.vtfOptions,
    (v) => {
        options.value = {
            ...getAppConfig().assetDefaults?.vtfOptions,
            ...v,
        };
    },
);

const assetStore = useAssetListStore();

provide(AssetInspectorTextureConvertInjectKey, {
    updateOptions(op) {
        const rawAsset = toRaw(props.asset);
        const rawOptions = toRaw(options.value);
        const opt: SharedVtfCreateOptions = toRaw({ ...rawOptions, ...op });

        for (let [key, val] of Object.entries(getAppConfig().assetDefaults?.vtfOptions ?? {})) {
            if ((opt as any)[key] === val) {
                (opt as any)[key] = undefined;
            }
        }

        if (opt.noMips === false) opt.noMips = undefined;
        if (opt.noThumbnail === false) opt.noThumbnail = undefined;
        if (opt.noAnimation === false) opt.noAnimation = undefined;

        const assetDef: SharedTextureAssetDefinition = { ...rawAsset.def, vtfOptions: opt };
        const newAsset: SharedAsset = { ...rawAsset, def: assetDef };
        const _ = assetStore.writeAssets([newAsset]);
    },
});
</script>

<style scoped></style>
