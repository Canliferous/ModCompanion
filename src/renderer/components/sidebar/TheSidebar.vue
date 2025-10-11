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

        <div class="grid gap-1 content-start p-1 pr-0">
            <div class="grid gap-1 border border-accented">
                <p class="text-xs px-3 py-1 select-none bg-neutral-800 border-b border-b-accented">Launchers</p>

                <UButton
                    v-for="btn of launcherButtons"
                    :label="btn.name"
                    @click="() => launch(btn.launcherType, btn.launcherArgs)"
                    size="sm"
                    variant="ghost"
                    class="mx-1"
                    color="neutral"
                >
                    <template #leading>
                        <BitmapIcon :name="btn.icon" class="w-4 h-4" />
                    </template>
                </UButton>

                <USeparator />

                <UButton
                    size="sm"
                    variant="ghost"
                    color="neutral"
                    label="Quit"
                    @click="() => quit()"
                    icon="tdesign:close"
                    class="mx-1 mb-1"
                />
            </div>
        </div>
    </aside>
</template>

<script setup lang="ts">
import BitmapIcon from "../common/BitmapIcon.vue";
import SidebarHotReloadSwitch from "~/components/sidebar/SidebarHotReloadSwitch.vue";
import SidebarAddPanelsButton from "~/components/sidebar/SidebarPanelsButton.vue";
import SidebarAddWorkspaceButton from "~/components/sidebar/SidebarAddWorkspaceButton.vue";
import SidebarCreateAsset from "~/components/sidebar/SidebarCreateAsset.vue";
import { launch, launcherButtons } from "~/model/LauncherButtons.js";

function quit() {
    window.electronAPI.app.exit();
}
</script>

<style scoped></style>
