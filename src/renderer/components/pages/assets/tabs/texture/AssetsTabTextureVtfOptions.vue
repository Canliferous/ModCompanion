<template>
    <div>
        <div class="bg-accented px-2 py-1 text-xs w-max">VTF Options</div>
        <div class="border-1 border-accented bg-neutral-800/50">
            <pre><code class="block p-1 text-mono text-xs">{{ vtfOptions }}</code></pre>
        </div>
    </div>
</template>

<script setup lang="ts">
import { getAppConfig } from "~/renderer-config.js";
import { SharedTextureAsset } from "Shared/SharedAssetDefinition.js";

const props = defineProps<{ asset: SharedTextureAsset }>();

const vtfOptions = computed(() => {
    const cfg = getAppConfig();
    const defaultOptions = cfg.assetDefaults?.vtfOptions;
    const assetOptions = props.asset.def.vtfOptions;
    const merged = { ...defaultOptions, ...assetOptions };

    return merged;
});
</script>

<style scoped></style>
