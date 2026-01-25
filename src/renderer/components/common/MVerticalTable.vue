<script setup lang="ts">
import { VerticalTableItem } from "~/components/common/MVerticalTable.model.js";

defineProps<{ items: VerticalTableItem[] }>();
</script>

<template>
    <div class="grid grid-cols-[auto,_1fr] content-start gap-x-4 justify-start w-max">
        <div
            v-for="item in items"
            :key="item.name"
            class="grid col-span-2 grid-cols-subgrid border-b last:border-b-0 border-accented/50 px-2 py-0.5"
        >
            <span>{{ item.name }}</span>
            <span>{{ item.value }}</span>
        </div>
    </div>
</template>

<style scoped></style>
