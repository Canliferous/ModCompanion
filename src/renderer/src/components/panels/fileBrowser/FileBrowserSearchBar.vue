<template>
    <UInput
        v-model="fileBrowserStore.searchTerm"
        size="sm"
        class="w-full *:h-8"
        :icon="AppDesign.Icons.Search"
        placeholder="Search"
    >
        <template v-if="fileBrowserStore.searchTerm.length > 0" #trailing>
            <UButton :icon="AppDesign.Icons.Close" variant="link" size="xs" @click="fileBrowserStore.searchTerm = ''" />
        </template>
    </UInput>
</template>
<script setup lang="ts">
import { AppDesign } from "~/design/AppDesign.js";
import { useFileBrowserStore } from "~/store/FileBrowserStore.js";

const fileBrowserStore = useFileBrowserStore();
</script>

<style scoped></style>
