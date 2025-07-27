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
    </div>
</template>

<script setup lang="ts">
import {
    SharedAsset,
    SharedAssetDefinition,
    SharedTextureAsset,
    SharedTextureAssetDefinition,
} from "Shared/SharedAssetDefinition.js";
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
import EnumSelect from "~/components/panels/assetInspector/textureConvert/EnumSelect.vue";
import { getAppConfig } from "~/renderer-config.js";
import { AssetInspectorTextureConvertInjectKey } from "~/components/panels/assetInspector/textureConvert/AssetInspectorTextureConvert.model.js";
import { useAssetListStore } from "~/store/AssetListStore.js";

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
        const assetDef: SharedTextureAssetDefinition = { ...rawAsset.def, vtfOptions: { ...rawOptions, ...op } };
        const newAsset: SharedAsset = { ...rawAsset, def: assetDef };
        const _ = assetStore.writeAssets([newAsset]);
    },
});
</script>

<style scoped></style>
