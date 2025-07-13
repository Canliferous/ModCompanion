<template>
    <div class="overflow-y-auto">
        <div class="grid" :class="`grid-cols-[${columnTemplate}]`">
            <DataTableRow v-for="(entry, i) in props.entries" :idx="i" :entry="entry" :columns="props.columns" />
        </div>
    </div>
</template>

<script setup lang="ts" generic="T">
import { DataTableColumn, DataTableSelectionInjectKey } from "~/components/common/DataTable/DataTable.model.js";

const props = defineProps<{ entries: T[]; columns: DataTableColumn<T>[] }>();

const columnTemplate = computed(() => props.columns.map((c) => c.size ?? "auto").join("_"));

const activeIdx = ref<number | undefined>();
const selectedIdx = ref<number[]>([]);
const selectStartIdx = ref<number | undefined>();

provide(DataTableSelectionInjectKey, {
    activeIdx,
    selectedIdx,
    selectStartIdx,
    deselect,
    startSelect,
    endSelect,
    toggleSelect,
});

function deselect(): void {
    activeIdx.value = undefined;
    selectedIdx.value = [];
    selectStartIdx.value = undefined;
}

function startSelect(startIdx: number): void {
    if (props.entries.length < startIdx) return;

    selectedIdx.value = [startIdx];
    activeIdx.value = startIdx;
    selectStartIdx.value = startIdx;
}

function endSelect(endIdx: number): void {
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
    for (let i = start; i < end; i++) {
        selectedIdxs.push(i);
    }

    selectedIdx.value = selectedIdxs;
    activeIdx.value = endIdx;
}

function toggleSelect(idx: number): void {
    const found = selectedIdx.value.some((p) => p === idx);

    const selPathsCopy = [...selectedIdx.value];
    if (found) {
        selPathsCopy.splice(idx, 1);
    } else {
        selPathsCopy.push(idx);
        activeIdx.value = idx;
    }

    selectedIdx.value = selPathsCopy;
}
</script>

<style scoped></style>
