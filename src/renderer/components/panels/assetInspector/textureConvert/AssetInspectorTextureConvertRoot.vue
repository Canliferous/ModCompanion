<template>
    <MPanelRoot>
        <div class="grid grid-cols-2 content-start gap-2">
            <UFormField label="Version">
                <EnumSelect
                    :enum="SharedVtfVersions"
                    :options="options"
                    field="version"
                    :default="defaults.version"
                    :label-func="getVtfVersionName"
                />
            </UFormField>
            <UFormField label="Format">
                <EnumSelect
                    :enum="SharedVtfImageFormats"
                    :options="options"
                    field="format"
                    :default="defaults.format"
                    :columns="3"
                    :grouping="getVtfImageFormatGrouping()"
                    :label-func="getVtfFormatName"
                    :disabled-func="isVtfFormatDisabled"
                />
            </UFormField>
            <UFormField label="Filter">
                <EnumSelect
                    :enum="SharedVtfFilters"
                    :options="options"
                    field="filter"
                    :default="defaults.filter"
                    :label-func="getVtfFilterName"
                />
            </UFormField>
            <UFormField label="Bump Scale">
                <AssetInspectorTextureConvertNumber
                    :options="options"
                    field="bumpScale"
                    :default="defaults.bumpScale"
                    :min="0"
                    :max="2"
                    :step="0.1"
                />
            </UFormField>

            <USeparator class="col-span-2" />

            <UFormField label="Compression Method">
                <EnumSelect
                    :enum="SharedVtfCompressionMethods"
                    :options="options"
                    field="compressionMethod"
                    :default="defaults.compressionMethod"
                    :label-func="getVtfCompressionMethodName"
                    :disabled-func="isVtfCompressionMethodDisabled"
                />
            </UFormField>
            <UFormField label="Compression Level">
                <!-- TODO: Deflate has max of 9 https://github.com/craftablescience/MareTF -->
                <AssetInspectorTextureConvertNumber
                    :options="options"
                    field="compressionLevel"
                    :default="defaults.compressionLevel"
                    :min="-1"
                    :max="22"
                />
            </UFormField>

            <USeparator class="col-span-2" />

            <UFormField label="Toggles" class="col-span-full">
                <div class="grid grid-cols-2 gap-2">
                    <AssetInspectorTextureConvertToggles :options="options" />
                </div>
            </UFormField>

            <USeparator class="col-span-2" />

            <AssetInspectorTextureConvertFlags :options="options" />
        </div>
    </MPanelRoot>
</template>

<script setup lang="ts">
import { SharedAsset, SharedTextureAsset, SharedTextureAssetDefinition } from "Shared/SharedAssetDefinition.js";
import { SharedVtfCreateOptions } from "Shared/vtf/SharedVtf.js";
import { getAppConfig } from "~/renderer-config.js";
import { AssetInspectorTextureConvertInjectKey } from "~/components/panels/assetInspector/textureConvert/AssetInspectorTextureConvert.model.js";
import { useAssetListStore } from "~/store/AssetListStore.js";
import AssetInspectorTextureConvertToggles from "~/components/panels/assetInspector/textureConvert/AssetInspectorTextureConvertToggles.vue";
import { getVtfVersionName, SharedVtfDefaultVersion, SharedVtfVersions } from "Shared/vtf/SharedVtfVersion.js";
import { getVtfFilterName, SharedVtfDefaultFilter, SharedVtfFilters } from "Shared/vtf/SharedVtfFilter.js";
import {
    getVtfCompressionMethodName,
    isVtfCompressionMethodDisabled,
    SharedVtfCompressionMethods,
    SharedVtfDefaultCompressionMethod,
} from "Shared/vtf/SharedVtfCompression.js";
import {
    getVtfFormatName,
    getVtfImageFormatGrouping,
    isVtfFormatDisabled,
    SharedVtfDefaultImageFormat,
    SharedVtfImageFormats,
} from "Shared/vtf/SharedVtfFormat.js";
import AssetInspectorTextureConvertFlags from "~/components/panels/assetInspector/textureConvert/AssetInspectorTextureConvertFlags.vue";
import { getVtfDefaults } from "~/helper/VtfDefaults.js";

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
const defaults = getVtfDefaults();

provide(AssetInspectorTextureConvertInjectKey, {
    updateOptions(op) {
        const rawAsset = toRaw(props.asset);
        const rawOptions = toRaw(options.value);
        const opt: SharedVtfCreateOptions = toRaw({ ...rawOptions, ...op });

        for (const [key, val] of Object.entries(getAppConfig().assetDefaults?.vtfOptions ?? {})) {
            if ((opt as any)[key] === val) {
                (opt as any)[key] = undefined;
            }
        }

        opt.flags = toRaw(opt.flags);

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
