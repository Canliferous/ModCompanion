<template>
    <template v-if="conversionStore.conversionHistory.length > 0">
        <div class="grid grid-cols-[1fr_auto] grid-rows-1 h-full">
            <ConversionsTable />
            <template v-if="conversionStore.activeHistory">
                <ConversionsDetails :item="conversionStore.activeHistory" />
            </template>
        </div>
    </template>

    <template v-else>
        <div class="grid place-items-center h-full text-muted">No conversions yet</div>
    </template>
</template>
<script setup lang="ts">
import ConversionsTable from "~/components/panels/conversions/ConversionsTable.vue";
import { useAssetConversionStore } from "~/store/AssetConversionStore.js";

const conversionStore = useAssetConversionStore();
</script>

<style scoped></style>
