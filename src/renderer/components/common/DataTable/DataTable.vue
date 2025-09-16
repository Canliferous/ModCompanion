<template>
    <div
        class="grid content-start p-1 w-full h-full"
        :class="noHeader ? 'grid-rows-[minmax(0,_1fr)]' : 'grid-rows-[auto_minmax(0,_1fr)]'"
        :style="`grid-template-columns: ${columnTemplate}`"
        @click="handleClickEmptyArea"
        @keydown="handleKeyDown"
    >
        <DataTableHeader v-if="!noHeader" :columns="columns" />
        <div class="grid col-span-full grid-cols-subgrid content-start pr-1 overflow-y-scroll" ref="grid">
            <DataTableRow
                v-for="(entry, i) in entriesHierarchy"
                :idx="i"
                :entry="entry.entry"
                :columns="props.columns"
                :draggable="draggable"
                :neutral-highlight="neutralHighlight"
                :depth="entry.depth"
                @dragStart="(e) => handleDragEvent(e, i, 'onDragStart')"
                @dragEnd="(e) => handleDragEvent(e, i, 'onDragEnd')"
            />
        </div>
    </div>
</template>

<script setup lang="ts" generic="T">
import {
    DataTableColumn,
    DataTableEntryActionInjectKey,
    DataTableSelectionInjectKey,
} from "~/components/common/DataTable/DataTable.model.js";
import DataTableHeader from "~/components/common/DataTable/DataTableHeader.vue";

const props = defineProps<{
    entries: T[];
    columns: DataTableColumn<T>[];
    noHeader?: boolean;
    draggable?: boolean;
    neutralHighlight?: boolean;
    tree?: boolean;
    treeChildFunc?: (entry: T) => T[] | undefined;
}>();

interface HierarchyEntry {
    entry: T;
    depth: number;
}

const entriesHierarchy = computed(() => {
    const func = props.treeChildFunc;
    if (func === undefined) {
        return props.entries.map<HierarchyEntry>((e) => ({ entry: e, depth: 0 }));
    }

    const result: HierarchyEntry[] = [];

    function populateResult(entries: T[], depth: number = 0): void {
        for (const entry of entries) {
            result.push({
                entry,
                depth,
            });
            const children = func?.(entry);
            if (children) {
                populateResult(children, depth + 1);
            }
        }
    }

    populateResult(props.entries);

    return result;
});

const emit = defineEmits<{
    onEntryActivated: [entry: T];
    onEntryContextMenu: [entry: T];
    onActiveChanged: [entry: T | undefined];
    onSelectionChanged: [entries: T[]];
    onDragStart: [event: DragEvent, primaryEntry: T, allEntries: T[]];
    onDragEnd: [event: DragEvent, primaryEntry: T, allEntries: T[]];
}>();
const gridEl = useTemplateRef("grid");

const columnTemplate = computed(() => props.columns.map((c) => c.size ?? "auto").join(" "));

const activeIdx = ref<number | undefined>();
const selectedIdx = ref<number[]>([]);
const selectStartIdx = ref<number | undefined>();

watch(activeIdx, (newIdx) => emit("onActiveChanged", newIdx ? entriesHierarchy.value[newIdx].entry : undefined));
watch(selectedIdx, (newIdxs) =>
    emit(
        "onSelectionChanged",
        newIdxs.map((i) => entriesHierarchy.value[i].entry),
    ),
);

provide(DataTableSelectionInjectKey, {
    activeIdx,
    selectedIdx,
    selectStartIdx,
    deselect,
    selectAll,
    startSelect,
    endSelect,
    toggleSelect,
    navigate,
});

provide(DataTableEntryActionInjectKey, {
    onEntryActivated: (idx: number) => emit("onEntryActivated", entriesHierarchy.value[idx].entry),
    onEntryContextMenu: (idx: number) => {
        // Make the right-clicked item active
        activeIdx.value = idx;
        selectedIdx.value = [...selectedIdx.value, idx].sort();

        emit("onEntryContextMenu", entriesHierarchy.value[idx].entry);
    },
});

defineExpose({
    focus: () => {
        const el = gridEl?.value;
        if (!el) return;
        const child = el.firstElementChild;
        if (!child) return;
        (child as any).focus?.();
    },
    selectAll,
    deselect,
    select,
});

function deselect(): void {
    activeIdx.value = undefined;
    selectedIdx.value = [];
    selectStartIdx.value = undefined;
}

function startSelect(startIdx: number): void {
    if (startIdx < 0) return;
    if (startIdx > entriesHierarchy.value.length - 1) return;

    selectedIdx.value = [startIdx];
    activeIdx.value = startIdx;
    selectStartIdx.value = startIdx;
}

function endSelect(endIdx: number): void {
    if (endIdx < 0) return;
    if (endIdx > entriesHierarchy.value.length - 1) return;
    if (activeIdx.value === undefined || selectStartIdx.value === undefined) {
        startSelect(endIdx);
        return;
    }
    const entries = entriesHierarchy.value;
    if (entries === undefined) return;
    const startIdx = selectStartIdx.value;

    if (entries.length < endIdx) return;
    if (entries.length < activeIdx.value) return;
    if (entries.length < startIdx) return;

    let start = startIdx < endIdx ? startIdx : endIdx;
    let end = startIdx > endIdx ? startIdx : endIdx;

    const selectedIdxs: number[] = [];
    for (let i = start; i <= end; i++) {
        selectedIdxs.push(i);
    }

    selectedIdx.value = selectedIdxs;
    activeIdx.value = endIdx;
}

function select(idxs: number[]): void {
    selectedIdx.value = idxs;
    activeIdx.value = undefined;
}

function toggleSelect(idx: number): void {
    const foundIdx = selectedIdx.value.findIndex((p) => p === idx);

    const selPathsCopy = [...selectedIdx.value];
    if (foundIdx > -1) {
        selPathsCopy.splice(foundIdx, 1);
    } else {
        selPathsCopy.push(idx);
        activeIdx.value = idx;
    }

    selectedIdx.value = selPathsCopy;
}

function selectAll(): void {
    // Select bottom to top so the top item is the active one
    startSelect(entriesHierarchy.value.length - 1);
    endSelect(0);
}

function navigate(up: boolean, shiftHeld: boolean): void {
    const active = activeIdx.value;
    if (active === undefined) {
        startSelect(0);
        return;
    }

    if (shiftHeld) {
        endSelect(active + (up ? -1 : 1));
    } else {
        startSelect(active + (up ? -1 : 1));
    }
}

// Shortcuts

function handleKeyDown(event: KeyboardEvent) {
    if (event.key === "a" && event.ctrlKey) {
        selectAll();
        event.stopPropagation();
        event.preventDefault();
    }
}

// Dragan drop

function handleDragEvent(event: DragEvent, idx: number, emitEvent: "onDragStart" | "onDragEnd"): void {
    if (selectedIdx.value.includes(idx)) {
        const orderedIdx = new Set([idx, ...selectedIdx.value]);
        //@ts-ignore
        emit(emitEvent, event, idx, Array.from(orderedIdx));
    } else {
        //@ts-ignore
        emit(emitEvent, event, idx, [idx]);
    }
}

// ----

function handleClickEmptyArea(): void {
    deselect();
}
</script>

<style scoped></style>
