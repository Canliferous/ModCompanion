<template>
    <div>
        <div class="flex gap-1">
            <UButton label="Open in Hammer" @click="handleEdit">
                <template #leading>
                    <MBitmapIcon :name="AppDesign.BitmapIcon.Launchers[SharedLaunchers.Hammer]" />
                </template>
            </UButton>
            <UButton label="Play in Game" @click="handlePlay">
                <template #leading>
                    <MBitmapIcon :name="AppDesign.BitmapIcon.Launchers[SharedLaunchers.Game]" />
                </template>
            </UButton>
        </div>
    </div>
</template>

<script setup lang="ts">
import { AppDesign } from "~/design/AppDesign.js";
import { SharedLaunchers } from "mod_companion_shared/SharedLaunchers.js";
import { openMapInGame, openMapInHammer } from "~/helper/LauncherHelper.js";
import { getAppConfig } from "~/renderer-config.js";
import pathe from "pathe";

const props = defineProps<{ path: string }>();

function handleEdit(): void {
    openMapInHammer(pathe.join(getAppConfig().rootPath, props.path));
}

function handlePlay(): void {
    openMapInGame(props.path);
}
</script>

<style scoped></style>
