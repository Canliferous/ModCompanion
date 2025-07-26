<template>
    <UInput
        placeholder="(unknown)"
        class="w-full"
        v-model="displayName"
        @submit="updateDisplayName"
        @blur="updateDisplayName"
        :disabled="disabled"
    />
</template>

<script setup lang="ts">
import { SharedAsset } from "Shared/SharedAssetDefinition.js";
import { AssetInspectorGeneralInjectKey } from "~/components/panels/assetInspector/generalPanel/AssetInspectorGeneral.model.js";
import { useAssetListStore } from "~/store/AssetListStore.js";

const props = defineProps<{ asset: SharedAsset }>();

const displayName = ref<string | undefined>(props.asset.def.displayName);
watch(
    () => props.asset.def.displayName,
    (n) => {
        displayName.value = n;
    },
);

const inj = inject(AssetInspectorGeneralInjectKey);

const assetStore = useAssetListStore();

const disabled = computed(() => (inj === undefined ? false : inj.waiting.value));
async function updateDisplayName() {
    if (displayName.value === props.asset.def.displayName) return;

    if (inj) {
        inj.waiting.value = true;
    }
    try {
        const result = await window.electronAPI.asset.updateDisplayName(props.asset.def.id, displayName.value ?? "");
        if (result) {
            assetStore.updateAssets([result]);
        }
        // Toast on failure?
    } finally {
        if (inj) {
            inj.waiting.value = false;
        }
    }
}
</script>

<style scoped></style>
