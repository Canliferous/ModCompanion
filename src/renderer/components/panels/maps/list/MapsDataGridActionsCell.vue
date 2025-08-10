<template>
    <div class="flex gap-2 bg-neutral-900">
        <UTooltip text="Open in Hammer">
            <UButton
                icon="famicons:hammer-sharp"
                color="info"
                variant="soft"
                @click="() => handleOpenInHammer(mapPath)"
            />
        </UTooltip>
        <UTooltip text="Open in Game">
            <UButton
                icon="tdesign:gamepad-1-filled"
                color="info"
                variant="soft"
                @click="() => handleOpenInGame(mapPath)"
            />
        </UTooltip>
        <UTooltip text="Compile Now">
            <UButton
                icon="tdesign:play"
                variant="soft"
                @click="() => compileStore.compileNow(mapPath)"
                :color="listStore.mapQueue.includes(mapPath) ? 'neutral' : 'success'"
                :disabled="listStore.mapQueue.includes(mapPath)"
            />
        </UTooltip>
        <UTooltip text="Remove from list">
            <UButton
                icon="tdesign:minus"
                variant="soft"
                @click="() => listStore.removeMap(mapPath)"
                :color="hasQueue ? 'neutral' : 'error'"
                :disabled="hasQueue"
            />
        </UTooltip>
        <UDropdownMenu :items="dropdownItems">
            <UButton icon="tdesign:more" variant="soft" color="neutral" />
        </UDropdownMenu>
    </div>
</template>

<script setup lang="ts">
import { filename } from "pathe/utils";
import pathe from "pathe";
import { getAppConfig } from "~/renderer-config.js";
import { computed, ref } from "vue";
import { useMapCompileStore } from "~/store/MapCompileStore.js";
import { useMapListStore } from "~/store/MapListStore.js";
import { DropdownMenuItem } from "@nuxt/ui/components/DropdownMenu.vue.js";

const compileStore = useMapCompileStore();
const listStore = useMapListStore();

const props = defineProps<{ mapPath: string }>();

const hasQueue = computed(() => listStore.mapQueue.length > 0);

function handleOpenInGame(mapPath: string) {
    const mapName = filename(mapPath);
    window.electronAPI.app.launch("game", `-dev -condebug +map ${mapName}`);
}
function handleOpenInHammer(mapPath: string) {
    const fullPath = pathe.join(getAppConfig().mapSourcePath, mapPath);
    window.electronAPI.app.launch("hammer", fullPath);
}

const dropdownItems = ref<DropdownMenuItem[][]>([
    [
        {
            label: "Browse to VMF",
            icon: "tdesign:file-code-1",
            onSelect(e: Event) {
                const filePath = pathe.join(getAppConfig().mapSourcePath, props.mapPath);
                window.electronAPI.app.browseToFile(filePath);
            },
        },
        {
            label: "Browse to BSP",
            icon: "tdesign:file-image",
            onSelect(e: Event) {
                const bspName = pathe.basename(props.mapPath).replace(".vmf", ".bsp");
                const filePath = pathe.join(getAppConfig().mapOutputPath, bspName);
                window.electronAPI.app.browseToFile(filePath);
            },
        },
    ],
]);
</script>

<style scoped></style>
