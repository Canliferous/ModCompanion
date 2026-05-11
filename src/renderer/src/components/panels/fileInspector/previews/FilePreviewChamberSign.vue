<template>
    <div>
        <template v-if="signConfig">
            <ChamberSignConfigRoot v-model="signConfig" />
        </template>
        <template v-else>
            <p>Invalid config</p>
        </template>
    </div>
</template>

<script setup lang="ts">
import { computedAsync } from "@vueuse/core";
const props = defineProps<{ path: string }>();

const signConfig = computedAsync(async () => {
    const fileContents = await window.electronAPI.file.readString(props.path);
    const parsed = JSON.parse(fileContents);
    return parsed;
}, undefined);
</script>

<style scoped></style>
