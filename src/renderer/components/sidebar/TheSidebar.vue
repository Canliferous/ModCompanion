<template>
    <aside class="h-full flex flex-col">
        <div class="grow grid gap-1 content-start p-1 pr-0">
            <div class="border border-accented">
                <p class="text-xs px-3 py-1 select-none bg-neutral-800 border-b border-b-accented">Workspace</p>
                <div class="p-1 grid gap-1 content-start">
                    <SidebarAddWorkspaceButton />
                    <SidebarAddPanelsButton />
                    <SidebarWorkspaces />
                </div>
            </div>

            <div class="border border-accented">
                <p class="text-xs px-3 py-1 select-none bg-neutral-800 border-b border-b-accented">Assets</p>
                <div class="p-1 grid gap-1 content-start">
                    <SidebarCreateAsset />
                    <SidebarHotReloadSwitch />
                </div>
            </div>
        </div>

        <div class="grid gap-1 content-start p-1">
            <SidebarInteropStatus />

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
import SidebarInteropStatus from "~/components/sidebar/SidebarInteropStatus.vue";

function quit() {
    window.electronAPI.app.exit();
}
</script>

<style scoped></style>
