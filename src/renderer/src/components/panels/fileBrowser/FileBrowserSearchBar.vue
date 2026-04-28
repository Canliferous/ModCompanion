<template>
    <UInput v-model="model" size="sm" class="w-full *:h-8" :icon="AppDesign.Icons.Search" placeholder="Search">
        <template v-if="model" #trailing>
            <UButton :icon="AppDesign.Icons.Close" variant="link" size="xs" @click="handleClear" />
        </template>
    </UInput>
</template>
<script setup lang="ts">
import { AppDesign } from "~/design/AppDesign.js";
import { useFileBrowserStore } from "~/store/FileBrowserStore.js";

const model = defineModel<string>();

function handleClear() {
    model.value = "";
}
</script>

<style scoped></style>
