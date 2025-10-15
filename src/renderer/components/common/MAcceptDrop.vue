<template>
    <div ref="dropZoneRef">
        <slot :isOverDropZone="isOverDropZone" />
    </div>
</template>

<script setup lang="ts">
import { useDropZone } from "@vueuse/core";
import { handleDrop } from "~/helper/DragDropData.js";

const model = defineModel<string>({ required: false });
const emit = defineEmits<{ change: [string] }>();
defineSlots<{
    default(props: { isOverDropZone: boolean }): any;
}>();

const dropZoneRef = ref<HTMLDivElement>();
async function onDrop(files: File[] | null, event: DragEvent) {
    const p = await handleDrop(files, event);
    if (p !== undefined) {
        model.value = p;
        emit("change", p);
    }
}
const { isOverDropZone } = useDropZone(dropZoneRef, {
    onDrop,
    preventDefaultForUnhandled: false,
});
</script>

<style scoped></style>
