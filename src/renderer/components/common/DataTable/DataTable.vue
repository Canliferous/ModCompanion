<template>
    <div
        class="grid grid-rows-[auto_minmax(0,_1fr)] content-start p-1 w-full h-full"
        :style="`grid-template-columns: ${columnTemplate}`"
        @keydown="handleKeyDown"
        ref="root"
    >
        <DataTableHeader :columns="columns" />
        <div class="grid col-span-full grid-cols-subgrid content-start pr-1 overflow-y-scroll" ref="grid">
            <DataTableRow v-for="(entry, i) in props.entries" :idx="i" :entry="entry" :columns="props.columns" />
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

const props = defineProps<{ entries: T[]; columns: DataTableColumn<T>[] }>();
const emit = defineEmits<{
    onEntryActivated: [idx: number];
    onEntryContextMenu: [idx: number];
    onActiveChanged: [idx: number | undefined];
    onSelectionChanged: [idx: number[]];
}>();
const rootEl = useTemplateRef("root");
const gridEl = useTemplateRef("grid");

const columnTemplate = computed(() => props.columns.map((c) => c.size ?? "auto").join(" "));

const activeIdx = ref<number | undefined>();
const selectedIdx = ref<number[]>([]);
const selectStartIdx = ref<number | undefined>();

watch(activeIdx, (newVal) => emit("onActiveChanged", newVal));
watch(selectedIdx, (newVal) => emit("onSelectionChanged", newVal));

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
    onEntryActivated: (idx: number) => emit("onEntryActivated", idx),
    onEntryContextMenu: (idx: number) => {
        // Make the right-clicked item active
        activeIdx.value = idx;
        selectedIdx.value = [...selectedIdx.value, idx].sort();

        emit("onEntryContextMenu", idx);
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
    if (startIdx > props.entries.length - 1) return;

    selectedIdx.value = [startIdx];
    activeIdx.value = startIdx;
    selectStartIdx.value = startIdx;
}

function endSelect(endIdx: number): void {
    if (endIdx < 0) return;
    if (endIdx > props.entries.length - 1) return;
    if (activeIdx.value === undefined || selectStartIdx.value === undefined) {
        startSelect(endIdx);
        return;
    }
    const entries = props.entries;
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
    startSelect(props.entries.length - 1);
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
</script>

<style scoped></style>
