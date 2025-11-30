<template>
    <div class="flex items-center gap-1" :class="{ 'bg-neutral-400/30': isOverDropZone }" ref="dropZoneRef">
        <UButton
            :icon="isExpanded ? AppDesign.Icons.ChevronDown : AppDesign.Icons.ChevronRight"
            variant="link"
            color="neutral"
            size="xs"
            class="p-0"
            @click="handleToggleExpanded()"
        />
        <UIcon :name="isExpanded ? AppDesign.Icons.FsFolderOpen : AppDesign.Icons.FsFolder" class="text-yellow-200" />
        <div
            class="text-sm text-neutral-300 tracking-wide text-ellipsis overflow-hidden text-left"
            :dir="editing ? 'ltr' : 'rtl'"
        >
            <span>&lrm;</span>
            <MInlineEditable
                :editing="editing"
                :value="name"
                @changed="handleNameChanged"
                @stopEditing="emit('stopEditing')"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { useDropZone } from "@vueuse/core";
import { deserializeAssetDragDropTransferData } from "~/helper/DragDropData.js";
import { useAssetGroupsStore } from "~/store/AssetGroupsStore.js";
import { SharedAssetGroupId } from "Shared/SharedAssetGroup.js";
import { AppDesign } from "~/design/AppDesign.js";
import { useAssetListStore } from "~/store/AssetListStore.js";

const groupsStore = useAssetGroupsStore();

const props = defineProps<{
    name: string;
    id: SharedAssetGroupId;
    editing?: boolean;
}>();
const emit = defineEmits<{
    stopEditing: [void];
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

function handleNameChanged(newName: string) {
    const group = useAssetGroupsStore().getGroup(props.id);
    if (group) {
        const newGroup = structuredClone(toRaw(group));
        newGroup.def.displayName = newName;
        useAssetGroupsStore().writeGroup(newGroup.id, newGroup.def);
    }
}
</script>

<style scoped></style>
