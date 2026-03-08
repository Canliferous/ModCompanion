<template>
    <div class="flex items-center gap-1">
        <div v-if="depth !== undefined" :style="`width: ${depth + 1}rem`" />
        <MAssetTypeIcon :type />
        <div
            class="text-sm text-neutral-300 tracking-wide text-ellipsis overflow-hidden text-left"
            :dir="editing ? 'ltr' : 'rtl'"
        >
            <span>&lrm;</span>
            <MInlineEditable
                :value="name"
                :editing="editing"
                @changed="handleNameChanged"
                @stop-editing="emit('stopEditing')"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { SharedAssetId, SharedAssetType } from "Shared/SharedAssetDefinition.js";
import { useAssetListStore } from "~/store/AssetListStore.js";

const props = defineProps<{
    id: SharedAssetId;
    name: string;
    type: SharedAssetType;
    depth?: number;
    editing?: boolean;
}>();
const emit = defineEmits<{
    stopEditing: [void];
}>();

function handleNameChanged(newName: string) {
    const asset = useAssetListStore().getAssetById(props.id);
    if (asset) {
        const newAsset = structuredClone(toRaw(asset));
        newAsset.def.displayName = newName;
        useAssetListStore().writeAssets([newAsset]);
    }
}
</script>

<style scoped></style>
