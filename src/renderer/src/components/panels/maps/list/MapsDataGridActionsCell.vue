<template>
    <UButtonGroup class="my-0.5">
        <UTooltip text="Compile Now">
            <UButton
                :icon="AppDesign.Icons.ActionCompileMap"
                :disabled="hasQueue"
                @click="() => compileStore.compileNow(mapPath)"
            />
        </UTooltip>
        <MapsDataGridActionCloudButton v-if="artifactCloudStore.connected" :map-path="mapPath" :disabled="hasQueue" />
        <UTooltip text="Open in Hammer">
            <UButton @click="() => handleOpenInHammer(mapPath)">
                <template #leading>
                    <MBitmapIcon :name="AppDesign.BitmapIcon.Launchers.hammer" />
                </template>
            </UButton>
        </UTooltip>
        <UTooltip text="Open in Game">
            <UButton @click="() => openMapInGame(mapPath)">
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
import * as pathe from "pathe";
import { getAppConfig } from "~/renderer-config.js";
import { computed, ref } from "vue";
import { useMapCompileStore } from "~/store/MapCompileStore.js";
import { useMapListStore } from "~/store/MapListStore.js";
import { DropdownMenuItem } from "@nuxt/ui/components/DropdownMenu.vue.js";
import { AppDesign } from "~/design/AppDesign.js";
import MapsDataGridActionCloudButton from "~/components/panels/maps/list/MapsDataGridActionCloudButton.vue";
import { openMapInGame, openMapInHammer } from "~/helper/LauncherHelper.js";
import { useArtifactCloudStore } from "~/store/ArtifactCloudStore.js";

const compileStore = useMapCompileStore();
const listStore = useMapListStore();
const artifactCloudStore = useArtifactCloudStore();

const props = defineProps<{ mapPath: string }>();

const hasQueue = computed(() => listStore.mapQueue.length > 0);

function handleOpenInHammer(mapPath: string) {
    openMapInHammer(pathe.join(getAppConfig().mapSourcePath, mapPath));
}

const dropdownItems = ref<DropdownMenuItem[][]>([
    [
        {
            label: "Browse to VMF",
            icon: AppDesign.Icons.ActionBrowseToFolder,
            onSelect() {
                const filePath = pathe.join(getAppConfig().mapSourcePath, props.mapPath);
                window.electronAPI.fileBrowser.browseTo(filePath);
            },
        },
        {
            label: "Browse to BSP",
            icon: AppDesign.Icons.ActionBrowseToFolder,
            onSelect() {
                const bspName = pathe.basename(props.mapPath).replace(".vmf", ".bsp");
                const filePath = pathe.join(getAppConfig().mapOutputPath, bspName);
                window.electronAPI.fileBrowser.browseTo(filePath);
            },
        },
    ],
]);
</script>

<style scoped></style>
