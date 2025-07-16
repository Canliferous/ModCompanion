<template>
    <div class="h-full grid grid-rows-[auto_minmax(0,_1fr)] grid-cols-1 gap-1">
        <div class="flex gap-1">
            <MapsToggleDrawerButton />
            <UInput placeholder="Search" block v-model="listStore.searchTerm" leading-icon="tdesign:search" />

            <div class="mx-auto">
                <!-- https://youtrack.secondfacesoftware.com/issue/REVO2-91 -->
                <!--                <PlayPauseStopControls />-->
            </div>
            <MapsTimeReportToggle />
            <MapsToggleConsoleButton />
        </div>
        <div class="flex flex-row gap-1">
            <MapsDrawer />
            <div class="grow overflow-x-auto">
                <MapsDataGrid />
            </div>
            <MapsConsole />
        </div>
    </div>
</template>

<script setup lang="ts">
import PlayPauseStopControls from "../../common/PlayPauseStopControls.vue";
import MapsDataGrid from "./list/MapsDataGrid.vue";
import { useMapListStore } from "../../../store/MapListStore.js";
import MapsToggleDrawerButton from "./MapsToggleDrawerButton.vue";
import MapsToggleConsoleButton from "./MapsToggleConsoleButton.vue";
import MapsDrawer from "./MapsDrawer.vue";
import MapsConsole from "./MapsConsole.vue";
import MapsTimeReportToggle from "./MapsTimeReportToggle.vue";

const listStore = useMapListStore();
</script>

<style scoped></style>
