<template>
    <aside class="h-full flex flex-col">
        <div class="grow">
            <div class="grid gap-1 content-start grid-cols-1 bg-primary-800/70 p-1">
                <p class="text-sm text-primary px-3 py-1 select-none">Workspace</p>
                <SidebarWorkspaces />
                <USeparator color="primary" class="opacity-20" />
                <SidebarAddWorkspaceButton />
                <SidebarAddPanelsButton />
            </div>

            <div class="grid gap-1 content-start grid-cols-1 bg-success-900/20 p-1">
                <p class="text-sm text-success px-3 py-1 select-none">Assets</p>
                <SidebarCreateAsset />
                <SidebarHotReloadSwitch />
            </div>
        </div>

        <div class="grid gap-1 content-start p-1">
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
import SidebarAddPanelsButton from "~/components/sidebar/SidebarPanelsButton.vue";
import SidebarAddWorkspaceButton from "~/components/sidebar/SidebarAddWorkspaceButton.vue";
import SidebarCreateAsset from "~/components/sidebar/SidebarCreateAsset.vue";

function quit() {
    window.electronAPI.app.exit();
}
</script>

<style scoped></style>
