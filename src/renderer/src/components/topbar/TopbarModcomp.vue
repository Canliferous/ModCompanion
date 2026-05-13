<template>
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
</template>

<script setup lang="ts">
import { DropdownMenuItem } from "@nuxt/ui/components/DropdownMenu.vue.js";
import { AppDesign } from "~/design/AppDesign.js";

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
</script>

<style scoped></style>
