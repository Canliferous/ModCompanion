<template>
    <MPanelRoot>
        <div class="grid grid-cols-2 content-start gap-2">
            <UFormField label="Version">
                <EnumSelect
                    :enum="Shared.Vtf.SharedVtfVersions"
                    :options="options"
                    field="version"
                    :default="defaults.version"
                    :label-func="Shared.Vtf.getVtfVersionName"
                />
            </UFormField>
            <UFormField label="Format">
                <EnumSelect
                    :enum="Shared.Vtf.SharedVtfImageFormats"
                    :options="options"
                    field="format"
                    :default="defaults.format"
                    :columns="3"
                    :grouping="Shared.Vtf.getVtfImageFormatGrouping()"
                    :label-func="Shared.Vtf.getVtfFormatName"
                    :disabled-func="Shared.Vtf.isVtfFormatDisabled"
                />
            </UFormField>
            <UFormField label="Filter">
                <EnumSelect
                    :enum="Shared.Vtf.SharedVtfFilters"
                    :options="options"
                    field="filter"
                    :default="defaults.filter"
                    :label-func="Shared.Vtf.getVtfFilterName"
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
                    :enum="Shared.Vtf.SharedVtfCompressionMethods"
                    :options="options"
                    field="compressionMethod"
                    :default="defaults.compressionMethod"
                    :label-func="Shared.Vtf.getVtfCompressionMethodName"
                    :disabled-func="Shared.Vtf.isVtfCompressionMethodDisabled"
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
import { getAppConfig } from "~/renderer-config.js";
import { AssetInspectorTextureConvertInjectKey } from "~/components/panels/assetInspector/textureConvert/AssetInspectorTextureConvert.model.js";
import { useAssetListStore } from "~/store/AssetListStore.js";
import AssetInspectorTextureConvertToggles from "~/components/panels/assetInspector/textureConvert/AssetInspectorTextureConvertToggles.vue";
import AssetInspectorTextureConvertFlags from "~/components/panels/assetInspector/textureConvert/AssetInspectorTextureConvertFlags.vue";
import { getVtfDefaults } from "~/helper/VtfDefaults.js";
import * as Shared from "mod_companion_shared";

const props = defineProps<{ asset: Shared.Asset.TextureAsset }>();

const options = ref<Shared.Vtf.SharedVtfCreateOptions>({
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
        const opt: Shared.Vtf.SharedVtfCreateOptions = toRaw({ ...rawOptions, ...op });

        for (const [key, val] of Object.entries(getAppConfig().assetDefaults?.vtfOptions ?? {})) {
            if ((opt as any)[key] === val) {
                (opt as any)[key] = undefined;
            }
        }

        opt.flags = toRaw(opt.flags);

        if (opt.noMips === false) opt.noMips = undefined;
        if (opt.noThumbnail === false) opt.noThumbnail = undefined;

        const assetDef: Shared.Asset.TextureAssetDef = { ...rawAsset.def, vtfOptions: opt };
        const newAsset: Shared.Asset.Asset = { ...rawAsset, def: assetDef };
        assetStore.writeAssets([newAsset]);
    },
});
</script>

<style scoped></style>
