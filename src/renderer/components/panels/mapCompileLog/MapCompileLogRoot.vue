<template>
    <MPanelRoot>
        <template #header>
            <div class="flex flex-wrap justify-between gap-2">
                <UTabs
                    v-model="mapConsoleStore.currentStep"
                    :items="stepTabItems"
                    size="sm"
                    color="neutral"
                    :content="false"
                />

                <USelect
                    :items="mapSelectItems"
                    placeholder="No maps"
                    class="min-w-30"
                    :disabled="mapSelectItems.length === 0"
                    value-key="id"
                    :ui="{ content: 'min-w-fit' }"
                    v-model="mapListStore.selectedMap"
                />
            </div>
        </template>
        <MLogArea :text="log ?? ''" />
    </MPanelRoot>
</template>

<script setup lang="ts">
import { useMapListStore } from "~/store/MapListStore.js";
import { useMapConsoleStore } from "~/store/MapConsoleStore.js";
import { computed, useTemplateRef, watch } from "vue";
import { useRememberRef } from "~/composables/useRemember.js";
import { TabsItem } from "@nuxt/ui/components/Tabs.vue.js";
import { SharedMapCompileStep } from "Shared/SharedMapCompile.js";
import { useMapDisplayNames } from "~/composables/useMapDisplayNames.js";

const mapListStore = useMapListStore();
const mapConsoleStore = useMapConsoleStore();

// const lineWrap = useRememberRef(ref(false), "map-compile-log-line-wrap");

const log = computed(() => {
    if (!mapListStore.selectedMap) {
        return "";
    }
    return mapConsoleStore.getLog(mapListStore.selectedMap, mapConsoleStore.currentStep);
});

const stepTabItems: TabsItem[] = [
    { label: "VBSP", value: SharedMapCompileStep.VBsp },
    { label: "POST", value: SharedMapCompileStep.Post },
    { label: "VVIS", value: SharedMapCompileStep.VVis },
    { label: "VRAD", value: SharedMapCompileStep.VRad },
    { label: "GAME", value: SharedMapCompileStep.Game },
    { label: "DONE", value: SharedMapCompileStep.Done },
];

const mapSelectItems = computed(() => {
    const combinedSet = new Set([...Array.from(mapConsoleStore.mapsWithLog), ...mapListStore.mapList]);
    return Array.from(useMapDisplayNames(Array.from(combinedSet)).entries()).map(([id, label]) => ({
        id,
        label,
    }));
});
</script>

<style scoped></style>
