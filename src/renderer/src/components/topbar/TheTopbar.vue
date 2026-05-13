<template>
    <nav class="grid grid-cols-[auto_1fr_auto] p-1 border-b border-b-neutral-800 app-region-drag overflow-x-clip">
        <div class="flex">
            <UDropdownMenu
                :items="itemsMain"
                size="sm"
                :ui="{ content: 'min-w-40' }"
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
                :items="itemsRun"
                size="sm"
                :ui="{ content: 'min-w-40' }"
                :content="{
                    align: 'start',
                }"
            >
                <UButton size="sm" label="Run" variant="link" />
            </UDropdownMenu>

            <UDropdownMenu
                :items="itemsAssets"
                size="sm"
                :ui="{ content: 'min-w-40' }"
                :content="{
                    align: 'start',
                }"
            >
                <UButton size="sm" label="Assets" variant="link" />
            </UDropdownMenu>

            <UDropdownMenu
                :items="itemsTools"
                size="sm"
                :ui="{ content: 'min-w-40' }"
                :content="{
                    align: 'start',
                }"
            >
                <template #fgd-leading>
                    <UIcon :name="fgdIcon" :class="{ 'animate-spin': fgdStore.building }" />
                </template>
                <UButton size="sm" label="Tools" variant="link" />
            </UDropdownMenu>

            <USeparator orientation="vertical" class="mx-1 py-1" />

            <div class="flex gap-1">
                <template v-for="id in workspaceStore.workspaces" :key="id">
                    <TopbarWorkspacesItem :id="id" />
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
            <UTooltip text="Hold Shift to fully close">
                <UButton
                    variant="ghost"
                    color="neutral"
                    class="text-neutral-400 hover:bg-error-500 hover:text-neutral-900 active:bg-error-700"
                    size="sm"
                    :icon="AppDesign.Icons.SystemClose"
                    @click="handleClose"
                />
            </UTooltip>
        </div>
    </nav>
</template>

<script setup lang="ts">
import { AppDesign } from "~/design/AppDesign.js";
import * as Shared from "mod_companion_shared";
import { useWorkspaceStore } from "~/store/WorkspaceStore.js";
import { NavigationMenuItem } from "@nuxt/ui";
import { DropdownMenuItem } from "@nuxt/ui/components/DropdownMenu.vue.js";
import { SharedLauncherOptions } from "mod_companion_shared/SharedLaunchers.js";
import { useRememberRef } from "~/composables/useRemember.js";
import { useAssetConversionStore } from "~/store/AssetConversionStore.js";
import { TakeOverId, useTakeOverStore } from "~/store/TakeOverStore.js";
import { useFgdStore } from "~/store/FgdStore.js";

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

const itemsRun = ref<DropdownMenuItem[][]>([
    Shared.Launchers.SharedLauncherOptions.map(
        (o) =>
            ({
                label: o.name,
                onSelect(e: Event) {
                    window.electronAPI.app.launch(o.type, o.args);
                },
            }) satisfies DropdownMenuItem,
    ),
]);

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

const hotReloadEnabled = useRememberRef(ref(true), "hot-reload-enabled");
window.electronAPI.hotReload.setEnabled(hotReloadEnabled.value);
watch(hotReloadEnabled, (on) => {
    window.electronAPI.hotReload.setEnabled(on);
});

const itemsAssets = computed<DropdownMenuItem[][]>(() => [
    [
        {
            label: "Create Asset",
            icon: AppDesign.Icons.ActionAdd,
            onSelect(e: Event) {
                useTakeOverStore().open(TakeOverId.AssetWizard);
            },
        },
        {
            label: "Convert All",
            icon: AppDesign.Icons.ActionConvertAsset,
            onSelect(e: Event) {
                useAssetConversionStore().enqueueAll();
            },
        },
        {
            label: "Auto Hot Reload",
            type: "checkbox" as const,
            icon: "empty",
            checked: hotReloadEnabled.value,
            onUpdateChecked(checked) {
                console.log("Ite happened!");
                hotReloadEnabled.value = checked;
            },
            onSelect(e: Event) {
                e.preventDefault();
            },
        },
    ],
]);

const fgdStore = useFgdStore();

const fgdIcon = computed(() => {
    if (fgdStore.building) {
        return AppDesign.Icons.Loading;
    }
    if (fgdStore.result === true) {
        return AppDesign.Icons.Check;
    }
    if (fgdStore.result === false) {
        return AppDesign.Icons.Close;
    }

    return AppDesign.Icons.ActionPlay;
});

const itemsTools = computed<DropdownMenuItem[][]>(() => [
    [
        {
            label: "Build FGD",
            slot: "fgd",
            onSelect(e) {
                e.preventDefault();
                fgdStore.buildFgd();
            },
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
