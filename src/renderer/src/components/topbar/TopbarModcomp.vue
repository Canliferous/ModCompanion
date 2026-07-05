<template>
    <UDropdownMenu
        :items="itemsMain"
        size="sm"
        :ui="{ content: 'min-w-50' }"
        :content="{
            align: 'start',
        }"
    >
        <UButton size="sm" variant="ghost">
            <template #leading>
                <MBitmapIcon name="mod_companion_192" class="h-4 w-4" />
            </template>
            <template #default>
                <span class="text-nowrap max-md:hidden text-muted">Mod Companion</span>
            </template>
        </UButton>

        <template #legend>
            <div class="select-none text-muted tabular-nums font-light text-center w-full">
                Made with 💜 v{{ useSystemStore().version }}
            </div>
        </template>
    </UDropdownMenu>
</template>

<script setup lang="ts">
import { DropdownMenuItem } from "@nuxt/ui/components/DropdownMenu.vue.js";
import { AppDesign } from "~/design/AppDesign.js";
import { useSystemStore } from "~/store/SystemStore.js";

const itemsMain = ref<DropdownMenuItem[][]>([
    [
        {
            label: "Source Code",
            icon: AppDesign.Icons.LinkExternal,
            onSelect(e) {
                window.electronAPI.app.openExternal("https://github.com/SecondFaceSoftware/ModCompanion");
            },
        },
        {
            type: "separator" as const,
        },
        {
            label: "Quit",
            icon: AppDesign.Icons.Close,
            onSelect(e) {
                window.electronAPI.app.exitForReal();
            },
        },
        {
            type: "separator" as const,
        },
        {
            type: "label" as const,
            slot: "legend",
        },
    ],
]);
</script>

<style scoped></style>
