<template>
    <UButtonGroup class="my-0.5">
        <UTooltip text="Compile Now">
            <UButton
                :icon="AppDesign.Icons.ActionCompileMap"
                :disabled="listStore.mapQueue.includes(mapPath)"
                @click="() => compileStore.compileNow(mapPath)"
            />
        </UTooltip>
        <MapsDataGridActionCloudButton v-if="tcArtifactsStore.connected" :map-path="mapPath" />
        <UTooltip text="Open in Hammer">
            <UButton @click="() => handleOpenInHammer(mapPath)">
                <template #leading>
                    <MBitmapIcon :name="AppDesign.BitmapIcon.Launchers.hammer" />
                </template>
            </UButton>
        </UTooltip>
        <UTooltip text="Open in Game">
            <UButton @click="() => handleOpenInGame(mapPath)">
                <template #leading>
                    <MBitmapIcon :name="AppDesign.BitmapIcon.Launchers.game" />
                </template>
            </UButton>
        </UTooltip>
        <UTooltip text="Remove from list">
            <UButton
                :icon="AppDesign.Icons.ActionRemove"
                :disabled="hasQueue"
                @click="() => listStore.removeMap(mapPath)"
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
import { AppDesign } from "~/design/AppDesign.js";
import { useTcArtifactsStore } from "~/store/TcArtifactsStore.js";
import MapsDataGridActionCloudButton from "~/components/panels/maps/list/MapsDataGridActionCloudButton.vue";
import * as Shared from "mod_companion_shared";

const compileStore = useMapCompileStore();
const listStore = useMapListStore();
const tcArtifactsStore = useTcArtifactsStore();

const props = defineProps<{ mapPath: string }>();

const hasQueue = computed(() => listStore.mapQueue.length > 0);

function handleOpenInGame(mapPath: string) {
    const mapName = filename(mapPath);
    window.electronAPI.app.launch(Shared.Launchers.SharedLaunchers.Game, `-dev -condebug +map ${mapName}`);
}
function handleOpenInHammer(mapPath: string) {
    const fullPath = pathe.join(getAppConfig().mapSourcePath, mapPath);
    window.electronAPI.app.launch(Shared.Launchers.SharedLaunchers.Hammer, fullPath);
}

const dropdownItems = ref<DropdownMenuItem[][]>([
    [
        {
            label: "Browse to VMF",
            icon: AppDesign.Icons.ActionBrowseToFolder,
            onSelect() {
                const filePath = pathe.join(getAppConfig().mapSourcePath, props.mapPath);
                window.electronAPI.fileBrowser.browseToFile(filePath);
            },
        },
        {
            label: "Browse to BSP",
            icon: AppDesign.Icons.ActionBrowseToFolder,
            onSelect() {
                const bspName = pathe.basename(props.mapPath).replace(".vmf", ".bsp");
                const filePath = pathe.join(getAppConfig().mapOutputPath, bspName);
                window.electronAPI.fileBrowser.browseToFile(filePath);
            },
        },
    ],
]);
</script>

<style scoped></style>
