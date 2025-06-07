<template>
    <div class="h-full grid grid-rows-[auto_minmax(0,_1fr)] grid-cols-1 gap-1">
        <div class="flex gap-2">
            <ToggleMapDrawerButton />
            <UInput placeholder="Search" block v-model="listStore.searchTerm" leading-icon="tdesign:search" />

            <div class="mx-auto">
                <PlayPauseStopControls />
            </div>
            <ToggleMapConsoleButton />
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
import MapsDataGrid from "./MapsDataGrid.vue";
import { useMapListStore } from "../../../store/MapListStore.js";
import ToggleMapDrawerButton from "./ToggleMapDrawerButton.vue";
import ToggleMapConsoleButton from "./ToggleMapConsoleButton.vue";
import MapsDrawer from "./MapsDrawer.vue";
import MapsConsole from "./MapsConsole.vue";

const listStore = useMapListStore();
</script>

<style scoped></style>
