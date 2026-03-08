<script setup lang="ts">
import { VerticalTableItem } from "~/components/common/MVerticalTable.model.js";

defineProps<{ items: VerticalTableItem[]; tabularNums?: boolean }>();
</script>

<template>
    <div
        class="grid grid-cols-[auto_1fr] content-start gap-x-2 border border-accented rounded inset-shadow-cave bg-neutral-900"
        :class="{ 'tabular-nums': tabularNums }"
    >
        <div
            v-for="item in items"
            :key="item.name"
            class="grid col-span-2 grid-cols-subgrid border-b last:border-b-0 border-accented/50 px-2 py-1"
        >
            <span>{{ item.name }}</span>
            <span>{{ item.value }}</span>
        </div>
    </div>
</template>

<style scoped></style>
