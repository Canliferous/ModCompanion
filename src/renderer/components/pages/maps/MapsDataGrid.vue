<template>
    <div class="grid grid-cols-[auto_10fr_repeat(6,1fr)_auto] gap-x-4">
        <div class="grid col-span-full grid-cols-subgrid items-center bg-elevated p-2 text-xs tracking-wider">
            <UCheckbox size="lg" />
            <div>Name</div>
            <div class="flex justify-center">VBSP</div>
            <div class="flex justify-center">POST</div>
            <div class="flex justify-center">VVIS</div>
            <div class="flex justify-center">VRAD</div>
            <div class="flex justify-center">GAME</div>
            <div class="flex justify-center">DONE</div>
            <div></div>
        </div>

        <div
            class="grid col-span-full grid-cols-subgrid p-2 items-center border-b-1 border-accented"
            v-for="map in listStore.filteredMapPaths"
        >
            <UCheckbox size="lg" />
            <div class="font-mono text-sm">
                {{ mapDisplayNames.get(map) }}
            </div>
            <div class="flex justify-center">
                <UIcon name="lucide:dot" />
            </div>
            <div class="flex justify-center">
                <UIcon name="lucide:dot" />
            </div>
            <div class="flex justify-center">
                <UIcon name="lucide:dot" />
            </div>
            <div class="flex justify-center">
                <UIcon name="lucide:dot" />
            </div>
            <div class="flex justify-center">
                <UIcon name="lucide:dot" />
            </div>
            <div class="flex justify-center">
                <UIcon name="lucide:dot" />
            </div>
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
                        @click="() => handleCompileNow(map)"
                        :color="mapQueue.includes(map) ? 'neutral' : 'success'"
                        :disabled="mapQueue.includes(map)"
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
    </div>
</template>

<script setup lang="ts">
import { computed, onBeforeMount, ref } from "vue";
import pathe from "pathe";
import { filename } from "pathe/utils";
import { getAppConfig } from "../../../renderer-config.js";
import { useMapListStore } from "../../../store/MapListStore.js";

const listStore = useMapListStore();

const mapQueue = ref<string[]>([]);
const hasQueue = computed(() => mapQueue.value.length > 0);

onBeforeMount(() => {
    window.electronAPI.map.subscribeQueueUpdated((arg) => {
        mapQueue.value = arg;
    });
});

function handleCompileNow(mapPath: string) {
    window.electronAPI.map.enqueue(mapPath);
}
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
