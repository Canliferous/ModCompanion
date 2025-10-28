<template>
    <template v-if="conversionStore.conversionHistory.length > 0">
        <ConversionsTable :history="conversionStore.conversionHistory" />
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
