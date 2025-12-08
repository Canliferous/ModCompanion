<template>
    <aside class="h-full flex flex-col">
        <div class="grow grid gap-1 content-start p-1 pr-0">
            <SidebarGroup heading="Workspace">
                <SidebarWorkspaces />

                <template #hint>
                    <SidebarAddWorkspaceButton />
                </template>
            </SidebarGroup>

            <SidebarGroup heading="Assets">
                <SidebarCreateAsset />
                <SidebarPotentialAssets />
                <SidebarHotReloadSwitch />
            </SidebarGroup>

            <SidebarGroup heading="Tools">
                <SidebarBuildFgdButton />
            </SidebarGroup>
        </div>

        <div class="grid gap-1 content-start p-1 pr-0">
            <SidebarGroup heading="Launchers">
                <UButton
                    size="sm"
                    variant="soft"
                    color="neutral"
                    class="bg-neutral-800"
                    v-for="option of SharedLauncherOptions"
                    :label="option.name"
                    @click="() => launch(option)"
                >
                    <template #leading>
                        <MBitmapIcon :name="AppDesign.BitmapIcon.Launchers[option.type]" class="w-4 h-4" />
                    </template>
                </UButton>

                <USeparator />

                <UButton
                    size="sm"
                    variant="soft"
                    color="neutral"
                    label="Quit"
                    class="bg-neutral-800"
                    :icon="AppDesign.Icons.Close"
                    @click="() => quit()"
                />
            </SidebarGroup>
        </div>
    </aside>
</template>

<script setup lang="ts">
import MBitmapIcon from "../common/MBitmapIcon.vue";
import SidebarHotReloadSwitch from "~/components/sidebar/SidebarHotReloadSwitch.vue";
import SidebarAddWorkspaceButton from "~/components/sidebar/SidebarAddWorkspaceButton.vue";
import SidebarCreateAsset from "~/components/sidebar/SidebarCreateAsset.vue";
import { AppDesign } from "~/design/AppDesign.js";
import SidebarBuildFgdButton from "~/components/sidebar/SidebarBuildFgdButton.vue";
import SidebarPotentialAssets from "~/components/sidebar/SidebarPotentialAssets.vue";
import { SharedLauncherOption, SharedLauncherOptions } from "Shared/SharedLaunchers.js";

function quit() {
    window.electronAPI.app.exit();
}

function launch(option: SharedLauncherOption) {
    window.electronAPI.app.launch(option.type, option.args);
}
</script>

<style scoped></style>
