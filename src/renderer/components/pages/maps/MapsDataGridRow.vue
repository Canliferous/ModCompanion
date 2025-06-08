<template>
    <div
        class="grid col-span-full grid-cols-subgrid p-2 items-center border-b-1 border-accented"
        :class="{ 'bg-neutral-500/10': listStore.selectedMap === map }"
        @click="() => listStore.selectMap(map)"
    >
        <UCheckbox size="lg" />
        <div class="font-mono text-sm">
            {{ mapDisplayNames.get(map) }}
        </div>
        <MapsDataGridProgressCell :map-path="map" :step="SharedMapCompileStep.VBsp" />
        <MapsDataGridProgressCell :map-path="map" :step="SharedMapCompileStep.Post" />
        <MapsDataGridProgressCell :map-path="map" :step="SharedMapCompileStep.VVis" />
        <MapsDataGridProgressCell :map-path="map" :step="SharedMapCompileStep.VRad" />
        <MapsDataGridProgressCell :map-path="map" :step="SharedMapCompileStep.Game" />
        <MapsDataGridProgressCell :map-path="map" :step="SharedMapCompileStep.Done" />
        <div class="flex gap-2">
            <UTooltip text="Open in Hammer">
                <UButton
                    icon="famicons:hammer-sharp"
                    color="info"
                    variant="soft"
                    @click="() => handleOpenInHammer(map)"
                />
            </UTooltip>
            <UTooltip text="Open in Game">
                <UButton
                    icon="tdesign:gamepad-1-filled"
                    color="info"
                    variant="soft"
                    @click="() => handleOpenInGame(map)"
                />
            </UTooltip>
            <UTooltip text="Compile Now">
                <UButton
                    icon="tdesign:play"
                    variant="soft"
                    @click="() => compileStore.compileNow(map)"
                    :color="listStore.mapQueue.includes(map) ? 'neutral' : 'success'"
                    :disabled="listStore.mapQueue.includes(map)"
                />
            </UTooltip>
            <UTooltip text="Remove from list">
                <UButton
                    icon="tdesign:minus"
                    variant="soft"
                    @click="() => listStore.removeMap(map)"
                    :color="hasQueue ? 'neutral' : 'error'"
                    :disabled="hasQueue"
                />
            </UTooltip>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useMapListStore } from "../../../store/MapListStore.js";
import { filename } from "pathe/utils";
import pathe from "pathe";
import { getAppConfig } from "../../../renderer-config.js";
import { computed } from "vue";
import { useMapCompileStore } from "../../../store/MapCompileStore.js";
import MapsDataGridProgressCell from "./MapsDataGridProgressCell.vue";
import { SharedMapCompileStep } from "../../../../shared/SharedMapCompile.js";

const listStore = useMapListStore();
const compileStore = useMapCompileStore();

const props = defineProps<{ map: string }>();

const hasQueue = computed(() => listStore.mapQueue.length > 0);

function handleOpenInGame(mapPath: string) {
    const mapName = filename(mapPath);
    window.electronAPI.app.launch("game", `-dev -condebug +map ${mapName}`);
}
function handleOpenInHammer(mapPath: string) {
    const fullPath = pathe.join(getAppConfig().mapSourcePath, mapPath);
    window.electronAPI.app.launch("hammer", fullPath);
}

const mapDisplayNames = computed(() => {
    let prefix: string | undefined = undefined;
    let addPrefix = false;

    for (const p of listStore.mapPaths) {
        const dirName = pathe.dirname(p);
        if (prefix === undefined) {
            prefix = dirName;
        } else if (prefix !== dirName) {
            addPrefix = true;
            break;
        }
    }

    const map = new Map<string, string>();
    for (const p of listStore.mapPaths) {
        const fileName = filename(p) ?? "";
        if (addPrefix) {
            const dirName = pathe.dirname(p);
            map.set(p, pathe.join(dirName, fileName));
        } else {
            map.set(p, fileName);
        }
    }

    return map;
});
</script>

<style scoped></style>
