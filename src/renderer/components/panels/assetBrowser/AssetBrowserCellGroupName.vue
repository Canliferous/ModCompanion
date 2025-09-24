<template>
    <div class="flex items-center gap-1" :class="{ 'bg-neutral-400/30': isOverDropZone }" ref="dropZoneRef">
        <UButton
            :icon="isExpanded ? 'tdesign:chevron-down' : 'tdesign:chevron-right'"
            variant="link"
            color="neutral"
            size="xs"
            class="p-0"
            @click="handleToggleExpanded()"
        />
        <UIcon :name="isExpanded ? 'tdesign:folder-open-1-filled' : 'tdesign:folder-filled'" class="text-yellow-200" />
        <div class="text-sm text-neutral-300 tracking-wide text-ellipsis overflow-hidden text-left" dir="rtl">
            &lrm;{{ name }}
        </div>
    </div>
</template>

<script setup lang="ts">
import { useDropZone } from "@vueuse/core";
import { deserializeAssetDragDropTransferData } from "~/helper/DragDropData.js";
import { useAssetGroupsStore } from "~/store/AssetGroupsStore.js";
import { SharedAssetGroupId } from "Shared/SharedAssetGroup.js";

const groupsStore = useAssetGroupsStore();

const props = defineProps<{
    name: string;
    id: SharedAssetGroupId;
}>();

const isExpanded = computed(() => groupsStore.isExpanded(props.id));

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

function handleToggleExpanded() {
    groupsStore.toggleCollapsed(props.id);
}
</script>

<style scoped></style>
