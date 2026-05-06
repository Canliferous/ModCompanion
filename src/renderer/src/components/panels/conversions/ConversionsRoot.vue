<template>
    <MPanelRoot no-scroll>
        <template v-if="conversionStore.conversionEvents.length > 0">
            <div class="grid grid-cols-2 h-full">
                <ConversionsTable :history="conversionStore.conversionEvents" />
                <ConversionDetailsPanel />
            </div>
        </template>

        <template v-else>
            <div class="grid place-items-center h-full text-muted">No conversions yet</div>
        </template>
    </MPanelRoot>
</template>
<script setup lang="ts">
import ConversionsTable from "~/components/panels/conversions/ConversionsTable.vue";
import { useAssetConversionStore } from "~/store/AssetConversionStore.js";

const conversionStore = useAssetConversionStore();
</script>

<style scoped></style>
