<template>
    <nav class="grid grid-cols-[auto_1fr_auto] p-1 border-b border-b-neutral-800 app-region-drag overflow-x-clip">
        <div class="flex gap-1">
            <UDropdownMenu
                :items="itemsMain"
                size="sm"
                :content="{
                    align: 'start',
                }"
            >
                <UButton size="sm" label="Mod Companion" variant="link">
                    <template #leading>
                        <MBitmapIcon name="mod_companion_192" class="h-4 w-4" />
                    </template>
                </UButton>
            </UDropdownMenu>

            <UDropdownMenu
                :items="itemsAssets"
                size="sm"
                :content="{
                    align: 'start',
                }"
            >
                <UButton size="sm" label="Assets" variant="link" />
            </UDropdownMenu>

            <UDropdownMenu
                :items="itemsTools"
                size="sm"
                :content="{
                    align: 'start',
                }"
            >
                <UButton size="sm" label="Tools" variant="link" />
            </UDropdownMenu>

            <USeparator orientation="vertical" />

            <template v-for="id in workspaceStore.workspaces" :key="id">
                <SidebarWorkspacesItem :id="id" />
            </template>

            <UTooltip text="New Workspace">
                <UButton
                    :icon="AppDesign.Icons.ActionAdd"
                    variant="link"
                    size="xs"
                    @click="workspaceStore.createWorkspace()"
                />
            </UTooltip>
        </div>

        <div class="app-region-drag-important"></div>

        <div class="flex">
            <UButton
                variant="ghost"
                color="neutral"
                class="text-neutral-400"
                size="sm"
                :icon="AppDesign.Icons.SystemMinimize"
                @click="handleMinimize"
            />
            <UButton
                variant="ghost"
                color="neutral"
                class="text-neutral-400"
                size="sm"
                :icon="AppDesign.Icons.SystemMaximize"
                @click="handleMaximize"
            />
            <UButton
                variant="ghost"
                color="neutral"
                class="text-neutral-400 hover:bg-error-500 hover:text-neutral-900 active:bg-error-700"
                size="sm"
                :icon="AppDesign.Icons.SystemClose"
                @click="handleClose"
            />
        </div>
    </nav>
</template>

<script setup lang="ts">
import { AppDesign } from "~/design/AppDesign.js";
import * as Shared from "mod_companion_shared";
import { useWorkspaceStore } from "~/store/WorkspaceStore.js";
import { NavigationMenuItem } from "@nuxt/ui";
import { DropdownMenuItem } from "@nuxt/ui/components/DropdownMenu.vue.js";

const workspaceStore = useWorkspaceStore();

function handleMinimize(): void {
    window.electronAPI.app.minimize();
}
function handleMaximize(): void {
    window.electronAPI.app.maximize();
}
function handleClose(event: MouseEvent): void {
    if (event.shiftKey) {
        window.electronAPI.app.exitForReal();
    } else {
        window.electronAPI.app.closeWindow();
    }
}

function launch(option: Shared.Launchers.SharedLauncherOption) {
    window.electronAPI.app.launch(option.type, option.args);
}

const itemsMain = ref<DropdownMenuItem[][]>([
    [
        {
            label: "Quit",
            icon: AppDesign.Icons.Close,
            onSelect(e) {
                window.electronAPI.app.exitForReal();
            },
        },
    ],
]);

const itemsAssets = ref<DropdownMenuItem[][]>([
    [
        {
            label: "Convert All",
            icon: AppDesign.Icons.ActionConvertAsset,
        },
        {
            label: "Create Asset",
            icon: AppDesign.Icons.ActionAdd,
        },
        {
            label: "Create Asset",
            icon: AppDesign.Icons.ActionAdd,
        },
    ],
]);

const itemsTools = ref<DropdownMenuItem[][]>([
    [
        {
            label: "Build FGD",
        },
    ],
]);
</script>

<style>
.app-region-drag {
    app-region: drag;
}
.app-region-drag-important {
    app-region: drag !important;
}
.app-region-drag * {
    app-region: no-drag;
}
</style>
