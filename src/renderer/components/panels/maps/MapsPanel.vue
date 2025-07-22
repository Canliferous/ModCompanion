<template>
    <div class="h-full grid grid-rows-[auto_minmax(0,_1fr)] grid-cols-1 gap-1">
        <div class="flex gap-1">
            <ModalMapList>
                <UButton label="Add" icon="tdesign:plus" color="success" variant="subtle" />
            </ModalMapList>
            <UInput placeholder="Search" block v-model="listStore.searchTerm" leading-icon="tdesign:search" />

            <div class="mx-auto">
                <!-- https://youtrack.secondfacesoftware.com/issue/REVO2-91 -->
                <!--                <PlayPauseStopControls />-->
            </div>
            <MapsTimeReportToggle />
        </div>
        <div class="overflow-x-auto">
            <MapsDataGrid />
        </div>
    </div>
</template>

<script setup lang="ts">
import MapsDataGrid from "./list/MapsDataGrid.vue";
import { useMapListStore } from "~/store/MapListStore.js";
import MapsTimeReportToggle from "./MapsTimeReportToggle.vue";
import ModalMapList from "~/components/modals/ModalMapList.vue";

const listStore = useMapListStore();
</script>

<style scoped></style>
