<template>
    <UTextarea
        v-model="credits"
        :disabled="disabled"
        @change="updateCredits"
        placeholder="Enter credits information..."
        class="w-full"
    />
</template>

<script setup lang="ts">
import { SharedAsset } from "Shared/SharedAssetDefinition.js";
import { AssetInspectorGeneralInjectKey } from "~/components/panels/assetInspector/generalPanel/AssetInspectorGeneral.model.js";

const props = defineProps<{ asset: SharedAsset }>();

const credits = ref<string | undefined>(props.asset.def.credits);
watch(
    () => props.asset.def.credits,
    (n) => {
        credits.value = n;
    },
);

const inj = inject(AssetInspectorGeneralInjectKey);

const disabled = computed(() => (inj === undefined ? false : inj.waiting.value));
function updateCredits() {
    if (credits.value === props.asset.def.credits) return;

    inj?.updateAsset({ credits: credits.value });
}
</script>

<style scoped></style>
