<template>
    <div class="grid items-center gap-1" :style="columnStyle">
        <div v-if="depth !== undefined" />
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
import { useAssetListStore } from "~/store/AssetListStore.js";
import * as Shared from "mod_companion_shared";

const props = defineProps<{
    id: Shared.Asset.AssetId;
    name: string;
    type: Shared.Asset.Type;
    depth?: number;
    editing?: boolean;
}>();
const emit = defineEmits<{
    stopEditing: [void];
}>();
const columnStyle = computed(() => `grid-template-columns: ${(props.depth ?? 0) + 1}rem auto 1fr`);

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
