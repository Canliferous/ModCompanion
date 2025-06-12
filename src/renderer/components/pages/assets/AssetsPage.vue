<template>
    <div class="grid grid-cols-[minmax(auto,_400px)_1fr] grid-rows-1 h-full gap-2">
        <div class="grid grid-rows-[auto_minmax(0,_1fr)] gap-1 h-full">
            <div class="flex gap-1">
                <AssetsSearchInput />
                <AssetsRefreshButton />
            </div>
            <AssetsDataGrid />
        </div>
        <div>
            <AssetsInfo />
        </div>
    </div>
</template>

<script setup lang="ts">
import AssetsDataGrid from "./AssetsDataGrid.vue";
import AssetsRefreshButton from "./AssetsRefreshButton.vue";
import AssetsSearchInput from "./AssetsSearchInput.vue";
import AssetsInfo from "./AssetsInfo.vue";
</script>

<style scoped></style>
