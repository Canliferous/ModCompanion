<template>
    <div class="h-full">
        <template v-if="asset">
            <slot :asset="asset" />
        </template>
        <MPanelFallbackMessage v-else>Invalid asset</MPanelFallbackMessage>
    </div>
</template>

<script setup lang="ts">
import * as Shared from "mod_companion_shared";
import { useAssetListStore } from "~/store/AssetListStore.js";
import { AssetInspectorBehavior } from "~/components/panels/assetInspector/AssetInspector.model.js";
import MPanelFallbackMessage from "~/components/common/MPanelFallbackMessage.vue";

const assetListStore = useAssetListStore();

const inj = inject(AssetInspectorBehavior.AssetInjectKey);
const asset = computed(() => assetListStore.getAssetById(inj?.assetId));

defineSlots<{
    default(props: { asset: Shared.Asset.Asset }): any;
}>();
</script>

<style scoped></style>
