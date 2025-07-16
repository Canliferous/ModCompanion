<template>
    <div class="grid col-span-full grid-cols-subgrid gap-x-1 text-sm text-neutral-400 select-none">
        <div v-for="column in columns">
            {{ column.label }}
        </div>
    </div>
</template>

<script setup lang="ts" generic="T">
import { DataTableColumn } from "~/components/common/DataTable/DataTable.model.js";

defineProps<{ columns: DataTableColumn<T>[] }>();
</script>

<style scoped></style>
