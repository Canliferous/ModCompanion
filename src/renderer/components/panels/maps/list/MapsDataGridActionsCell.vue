<template>
    <UButtonGroup class="flex bg-neutral-900">
        <UTooltip text="Compile Now">
            <UButton
                :icon="AppDesign.Icons.ActionCompileMap"
                @click="() => compileStore.compileNow(mapPath)"
                :disabled="listStore.mapQueue.includes(mapPath)"
            />
        </UTooltip>
        <UTooltip text="Open in Hammer">
            <UButton @click="() => handleOpenInHammer(mapPath)">
                <template #leading>
                    <MBitmapIcon :name="AppDesign.BitmapIcon.Hammer" />
                </template>
            </UButton>
        </UTooltip>
        <UTooltip text="Open in Game">
            <UButton @click="() => handleOpenInGame(mapPath)">
                <template #leading>
                    <MBitmapIcon :name="AppDesign.BitmapIcon.Game" />
                </template>
            </UButton>
        </UTooltip>
        <UTooltip text="Remove from list">
            <UButton
                :icon="AppDesign.Icons.ActionRemove"
                @click="() => listStore.removeMap(mapPath)"
                :disabled="hasQueue"
            />
        </UTooltip>
        <UDropdownMenu :items="dropdownItems">
            <UButton :icon="AppDesign.Icons.EllipsisVertical" />
        </UDropdownMenu>
    </UButtonGroup>
</template>

<script setup lang="ts">
import { filename } from "pathe/utils";
import pathe from "pathe";
import { getAppConfig } from "~/renderer-config.js";
import { computed, ref } from "vue";
import { useMapCompileStore } from "~/store/MapCompileStore.js";
import { useMapListStore } from "~/store/MapListStore.js";
import { DropdownMenuItem } from "@nuxt/ui/components/DropdownMenu.vue.js";
import { AppDesign, BitmapIcon } from "~/design/AppDesign.js";

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
            icon: AppDesign.Icons.ActionBrowseToFolder,
            onSelect(e: Event) {
                const filePath = pathe.join(getAppConfig().mapSourcePath, props.mapPath);
                window.electronAPI.app.browseToFile(filePath);
            },
        },
        {
            label: "Browse to BSP",
            icon: AppDesign.Icons.ActionBrowseToFolder,
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
