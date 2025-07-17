<template>
    <button
        class="grid col-span-full grid-cols-subgrid items-center px-1 gap-x-1 text-left cursor-pointer outline-none hover:bg-accented"
        :class="{ 'bg-primary-500/40': isActive, 'bg-primary-500/20 hover:bg-primary-500/50': isSelected }"
        @focus="handleFocused"
        @mousedown="handleMouseDown"
        @mouseover="handleMouseOver"
        @contextmenu="handleContextMenu"
        @dblclick="handleDoubleClick"
        @keydown.down="handleDown"
        @keydown.up="handleUp"
        @keydown.enter="handleEnter"
    >
        <component v-for="col in columns" :is="col.cell ? col.cell(entry) : 'div'" />
    </button>
</template>

<script setup lang="ts" generic="T">
import {
    DataTableColumn,
    DataTableEntryActionInjectKey,
    DataTableSelectionInjectKey,
} from "~/components/common/DataTable/DataTable.model.js";

const props = defineProps<{ entry: T; idx: number; columns: DataTableColumn<T>[] }>();

const selection = inject(DataTableSelectionInjectKey);
const entryAction = inject(DataTableEntryActionInjectKey);

const isActive = computed(() => selection?.activeIdx.value === props.idx);
const isSelected = computed(() => selection?.selectedIdx.value.includes(props.idx));

function handleFocused(event: FocusEvent): void {
    selection?.startSelect(props.idx);
}

function handleMouseDown(event: MouseEvent): void {
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
    event.stopPropagation();
    event.preventDefault();
}

function handleMouseOver(event: MouseEvent): void {
    // Left mouse dragged
    if (event.buttons === 1) {
        selection?.endSelect(props.idx);
    }
}

function handleContextMenu(event: MouseEvent): void {
    event.stopPropagation();

    entryAction?.onEntryContextMenu(props.idx);
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
</script>

<style scoped></style>
