<template>
    <MPanelRoot alwaysShowScroll>
        <template #header>
            <div class="flex gap-1">
                <MapAddButton />
                <MapPresetButton />
                <UInput
                    placeholder="Search"
                    block
                    v-model="listStore.searchTerm"
                    :leading-icon="AppDesign.Icons.Search"
                />

                <div class="mx-auto">
                    <MPlayPauseStopControls />
                </div>
                <MapsTimeReportToggle />
            </div>
        </template>
        <div class="overflow-x-auto">
            <MapsDataGrid />
        </div>
    </MPanelRoot>
</template>

<script setup lang="ts">
import MapsDataGrid from "./list/MapsDataGrid.vue";
import { useMapListStore } from "~/store/MapListStore.js";
import MapsTimeReportToggle from "./MapsTimeReportToggle.vue";
import { AppDesign } from "~/design/AppDesign.js";
import MapPresetButton from "~/components/panels/maps/MapPresetButton.vue";
import MapAddButton from "~/components/panels/maps/MapAddButton.vue";

const listStore = useMapListStore();
</script>

<style scoped></style>
