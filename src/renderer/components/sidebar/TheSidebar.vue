<template>
    <aside class="h-full flex flex-col">
        <div class="grow grid gap-1 content-start">
            <SidebarPanels />
            <SidebarWorkspaces />
        </div>

        <div class="grid gap-1 content-start">
            <SidebarHotReload />
            <USeparator />
            <UButton
                v-for="btn of launcherButtons"
                :color="btn.color"
                @click="() => launch(btn.launcherType, btn.launcherArgs)"
                :label="btn.name"
                size="small"
                variant="soft"
            >
                <template #leading>
                    <BitmapIcon :name="btn.icon" class="size-4 mx-2" />
                </template>
            </UButton>

            <USeparator />
            <UButton size="small" variant="soft" color="neutral" label="Quit Sibelius" @click="() => quit()">
                <template #leading>
                    <UIcon class="h-4 mx-2" name="tdesign:close-rectangle-filled" />
                </template>
            </UButton>
        </div>
    </aside>
</template>

<script setup lang="ts">
import BitmapIcon from "../common/BitmapIcon.vue";
import { launch, launcherButtons } from "~/model/LauncherButtons.js";
import SidebarHotReloadSwitch from "~/components/sidebar/SidebarHotReloadSwitch.vue";
import SidebarPanels from "~/components/sidebar/SidebarPanels.vue";

function quit() {
    window.electronAPI.app.exit();
}
</script>

<style scoped></style>
