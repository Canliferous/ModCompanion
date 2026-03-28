<template>
    <button
        class="grid col-span-full grid-cols-subgrid items-center px-1 mr-1 gap-x-1 text-sm text-left cursor-pointer outline-none rounded hover:bg-accented hover:shadow transition-colors"
        :class="rowHighlightClass"
        :draggable="draggable"
        @click="handleClick"
        @contextmenu="handleContextMenu"
        @dblclick="handleDoubleClick"
        @keydown.down="handleDown"
        @keydown.up="handleUp"
        @keydown.enter="handleEnter"
        @dragstart="(e) => emit('dragStart', e)"
        @dragend="(e) => emit('dragEnd', e)"
    >
        <component :is="col.cell ? (col.cell(entry, depth) ?? 'div') : 'div'" v-for="col in columns" :key="col.id" />
    </button>
</template>

<script setup lang="ts" generic="T">
import {
    DataTableColumn,
    DataTableEntryActionInjectKey,
    DataTableSelectionInjectKey,
} from "~/components/common/dataTable/MDataTable.model.js";

const props = defineProps<{
    entry: T;
    idx: number;
    columns: DataTableColumn<T>[];
    draggable?: boolean;
    depth: number;
}>();

const selection = inject(DataTableSelectionInjectKey);
const entryAction = inject(DataTableEntryActionInjectKey);

const isActive = computed(() => selection?.activeIdx.value === props.idx);
const isSelected = computed(() => selection?.selectedIdx.value.includes(props.idx));

const emit = defineEmits<{
    dragStart: [event: DragEvent];
    dragEnd: [event: DragEvent];
}>();

function handleClick(event: MouseEvent): void {
    event.stopPropagation();

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

function handleContextMenu(event: MouseEvent): void {
    entryAction?.onEntryContextMenu(event, props.idx);
}

function handleDoubleClick(event: MouseEvent): void {
    event.stopPropagation();
    entryAction?.onEntryActivated(props.idx);
}

function handleDown(event: KeyboardEvent): void {
    selection?.navigate(false, event.shiftKey);
    event.stopPropagation();
}

function handleUp(event: KeyboardEvent): void {
    selection?.navigate(true, event.shiftKey);
    event.stopPropagation();
}

function handleEnter(event: KeyboardEvent): void {
    event.stopPropagation();
    entryAction?.onEntryActivated(props.idx);
}
const rowHighlightClass = computed(() => ({
    "bg-neutral-750 hover:bg-neutral-600": isSelected.value && !isActive.value,
    "bg-neutral-700 hover:bg-neutral-600": isActive.value,
}));
</script>

<style scoped></style>
