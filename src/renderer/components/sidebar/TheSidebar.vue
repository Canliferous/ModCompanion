<template>
    <aside class="h-full flex flex-col">
        <div class="grow grid gap-1 content-start p-1 pr-0">
            <SidebarGroup heading="Workspace">
                <SidebarAddWorkspaceButton />
                <SidebarAddPanelsButton />
                <SidebarWorkspaces />
            </SidebarGroup>

            <SidebarGroup heading="Assets">
                <SidebarCreateAsset />
                <SidebarHotReloadSwitch />
            </SidebarGroup>
        </div>

        <div class="grid gap-1 content-start p-1 pr-0">
            <SidebarGroup heading="Launchers">
                <UButton
                    v-for="btn of launcherButtons"
                    :label="btn.name"
                    @click="() => launch(btn.launcherType, btn.launcherArgs)"
                    size="sm"
                    variant="ghost"
                    s
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
                />
            </SidebarGroup>
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
