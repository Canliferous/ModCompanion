<template>
    <div class="p-2 grid grid-cols-2 gap-2">
        <UFormField label="ID" class="col-span-2">
            <UInput disabled v-model="asset.def.id" class="w-full" />
        </UFormField>
        <UFormField label="Display Name" class="col-span-2">
            <UInput
                placeholder="(unknown)"
                class="w-full"
                v-model="displayName"
                @submit="updateDisplayName"
                @blur="updateDisplayName"
                :disabled="waiting"
            />
        </UFormField>
        <UFormField label="Type">
            <USelect :items="selectItems" v-model="assetType" value-key="id" :icon="icon" class="w-full" />
        </UFormField>
    </div>
</template>

<script setup lang="ts">
import { SharedAsset, SharedAssetType } from "Shared/SharedAssetDefinition.js";
import { useAssetListStore } from "~/store/AssetListStore.js";
import { getAssetTypeIcon, getAssetTypeName } from "~/design/AppDesign.js";
import { SelectItem } from "@nuxt/ui/components/Select.vue.js";

const props = defineProps<{ asset: SharedAsset }>();

const assetStore = useAssetListStore();
const displayName = ref(props.asset.def.displayName);
const assetType = ref(props.asset.def.type);

const waiting = ref(false);

provide("waiting", waiting);

async function updateDisplayName() {
    if (displayName.value === props.asset.def.displayName) return;

    waiting.value = true;
    try {
        const result = await window.electronAPI.asset.updateDisplayName(props.asset.def.id, displayName.value ?? "");
        if (result) {
            assetStore.updateAssets([result]);
        }
        // Toast on failure?
    } finally {
        waiting.value = false;
    }
}

const selectItems = Object.values(SharedAssetType).map<SelectItem>((t) => ({
    id: t,
    label: getAssetTypeName(t),
    icon: getAssetTypeIcon(t),
}));
const icon = computed(() => selectItems.find((item) => item.value === assetType.value)?.icon);
</script>

<style scoped></style>
