<template>
    <button
        class="grid col-span-full grid-cols-subgrid items-center px-1 gap-x-1 text-sm text-left cursor-pointer outline-none hover:bg-accented"
        :class="rowHighlightClass"
        @click="handleClick"
        @contextmenu="handleContextMenu"
        @dblclick="handleDoubleClick"
        @keydown.down="handleDown"
        @keydown.up="handleUp"
        @keydown.enter="handleEnter"
        :draggable="draggable"
        @dragstart="(e) => emit('dragStart', e)"
        @dragend="(e) => emit('dragEnd', e)"
    >
        <component v-for="col in columns" :is="col.cell ? (col.cell(entry, depth) ?? 'div') : 'div'" />
    </button>
</template>

<script setup lang="ts" generic="T">
import {
    DataTableColumn,
    DataTableEntryActionInjectKey,
    DataTableSelectionInjectKey,
} from "~/components/common/DataTable/DataTable.model.js";

const props = defineProps<{
    entry: T;
    idx: number;
    columns: DataTableColumn<T>[];
    draggable?: boolean;
    neutralHighlight?: boolean;
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
const rowHighlightClass = computed(() =>
    props.neutralHighlight
        ? {
              "bg-neutral-750 hover:bg-neutral-600": isSelected && !isActive,
              "bg-neutral-700 hover:bg-neutral-600": isActive,
          }
        : {
              "bg-primary-700 hover:bg-primary-500": isSelected && !isActive,
              "bg-primary-600 hover:bg-primary-500": isActive,
          },
);
</script>

<style scoped></style>
