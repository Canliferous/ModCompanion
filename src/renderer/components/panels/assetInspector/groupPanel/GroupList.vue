<template>
    <div
        ref="dropZoneRef"
        class="border border-accented rounded bg-neutral-900 inset-shadow-cave"
        :class="{ 'border-primary-400': isOverDropZone }"
    >
        <div
            v-for="(assetId, i) in group.def.assets"
            class="grid grid-cols-[1fr_auto_auto] not-last:border-b border-accented"
        >
            <GroupListEntry :asset-id="assetId" :group-id="group.id" @remove="() => remove(i)" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { SharedAssetGroup } from "Shared/SharedAssetGroup.js";
import GroupListEntry from "~/components/panels/assetInspector/groupPanel/GroupListEntry.vue";
import { useDropZone } from "@vueuse/core";
import { deserializeAssetDragDropTransferData } from "~/helper/DragDropData.js";
import { SharedAssetId } from "Shared/SharedAssetDefinition.js";

defineProps<{
    group: SharedAssetGroup;
}>();

const emit = defineEmits<{
    remove: [index: number];
    add: [ids: SharedAssetId[]];
}>();

function remove(index: number) {
    emit("remove", index);
}

async function onDrop(fileList: File[] | null, event: DragEvent) {
    const data = event.dataTransfer?.getData("text/plain");
    if (data === undefined) return;
    const deserializedData = deserializeAssetDragDropTransferData(data);

    if (deserializedData.assetIds.length > 0) {
        emit("add", deserializedData.assetIds);
    }
}

const dropZoneRef = ref<HTMLDivElement>();
const { isOverDropZone } = useDropZone(dropZoneRef, {
    onDrop,
    preventDefaultForUnhandled: false,
});
</script>

<style scoped></style>
