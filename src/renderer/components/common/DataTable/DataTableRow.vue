<template>
    <button
        class="grid col-span-full grid-cols-subgrid items-center gap-x-2 px-2 text-left cursor-pointer outline-none hover:bg-accented"
        :class="{ 'bg-primary-500/40': isActive, 'bg-primary-500/20 hover:bg-primary-500/50': isSelected }"
        @click="handleClick"
        @contextmenu="handleClick"
    >
        <component v-for="col in columns" :is="col.cell ? col.cell(entry) : 'div'" />
    </button>
</template>

<script setup lang="ts" generic="T">
import { DataTableColumn, DataTableSelectionInjectKey } from "~/components/common/DataTable/DataTable.model.js";

const props = defineProps<{ entry: T; idx: number; columns: DataTableColumn<T>[] }>();

const selection = inject(DataTableSelectionInjectKey);

const isActive = computed(() => selection?.activeIdx.value === props.idx);
const isSelected = computed(() => selection?.selectedIdx.value.includes(props.idx));

function handleClick(event: MouseEvent): void {
    const shift = event.shiftKey;
    const control = event.ctrlKey;

    if (!shift) {
        if (control) {
            selection?.toggleSelect(props.idx);
        } else {
            selection?.startSelect(props.idx);
        }
    } else {
        selection?.endSelect(props.idx);
    }
}

// function handleDoubleClick(event: MouseEvent): void {
//     if (!props.entry.isFile) {
//         useLooseFilesStore().currentDir = props.entry.path;
//     } else {
//         window.electronAPI.project.launchFile(props.entry.path);
//     }
// }
</script>

<style scoped></style>
