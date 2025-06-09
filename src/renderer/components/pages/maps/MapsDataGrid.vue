<template>
    <div class="grid grid-cols-[auto_10fr_repeat(6,1fr)_auto] gap-x-4">
        <div class="grid col-span-full grid-cols-subgrid items-center bg-elevated p-2 text-xs tracking-wider">
            <UCheckbox size="lg" />
            <div>Name</div>
            <div class="flex justify-center">VBSP</div>
            <div class="flex justify-center" v-if="!timeReportStore.showReport">POST</div>
            <div class="flex justify-center">VVIS</div>
            <div class="flex justify-center">VRAD</div>
            <div class="flex justify-center" v-if="!timeReportStore.showReport">GAME</div>
            <div class="flex justify-center" v-if="!timeReportStore.showReport">DONE</div>
            <div class="flex justify-center" v-if="timeReportStore.showReport">TOTAL</div>
            <div></div>
        </div>

        <MapsDataGridRow v-for="map in listStore.filteredMapPaths" :map="map" />
    </div>
</template>

<script setup lang="ts">
import { useMapListStore } from "../../../store/MapListStore.js";
import MapsDataGridRow from "./MapsDataGridRow.vue";
import { useMapTimeReportStore } from "../../../store/MapTimeReportStore.js";

const listStore = useMapListStore();
const timeReportStore = useMapTimeReportStore();
</script>

<style scoped></style>
