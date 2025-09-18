<template>
    <div class="flex items-center gap-1" :class="{ 'bg-amber-400/30': isOverDropZone }" ref="dropZoneRef">
        <UIcon :name="AppDesign.icons.assetGroup" class="text-amber-400" />
        <div class="text-sm font-mono text-ellipsis overflow-hidden text-left" dir="rtl">{{ name }}</div>
    </div>
</template>

<script setup lang="ts">
import AppDesign from "~/design/AppDesign.js";
import { useDropZone } from "@vueuse/core";
import { deserializeAssetDragDropTransferData } from "~/helper/DragDropData.js";
import { useAssetGroupsStore } from "~/store/AssetGroupsStore.js";
import { SharedAssetGroupId } from "Shared/SharedAssetGroup.js";

const props = defineProps<{
    name: string;
    id: SharedAssetGroupId;
}>();

function onDrop(files: File[] | null, event: DragEvent) {
    const data = event.dataTransfer?.getData("text/plain");
    if (data === undefined) return;
    const deserializedData = deserializeAssetDragDropTransferData(data);
    if (deserializedData.assetIds.length == 0) return;

    return useAssetGroupsStore().writeAddAssetsToGroup(props.id, deserializedData.assetIds);
}

const dropZoneRef = ref<HTMLDivElement>();
const { isOverDropZone } = useDropZone(dropZoneRef, {
    onDrop,
    preventDefaultForUnhandled: false,
});
</script>

<style scoped></style>
