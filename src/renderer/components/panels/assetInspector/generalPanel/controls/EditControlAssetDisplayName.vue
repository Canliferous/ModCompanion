<template>
    <UInput
        placeholder="(unknown)"
        class="w-full"
        v-model="displayName"
        @change="updateDisplayName"
        :disabled="disabled"
    />
</template>

<script setup lang="ts">
import { SharedAsset } from "Shared/SharedAssetDefinition.js";
import { AssetInspectorGeneralInjectKey } from "~/components/panels/assetInspector/generalPanel/AssetInspectorGeneral.model.js";

const props = defineProps<{ asset: SharedAsset }>();

const displayName = ref<string | undefined>(props.asset.def.displayName);
watch(
    () => props.asset.def.displayName,
    (n) => {
        displayName.value = n;
    },
);

const inj = inject(AssetInspectorGeneralInjectKey);

const disabled = computed(() => (inj === undefined ? false : inj.waiting.value));
function updateDisplayName() {
    if (displayName.value === props.asset.def.displayName) return;

    inj?.updateAsset({ displayName: displayName.value });
}
</script>

<style scoped></style>
