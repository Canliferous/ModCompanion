<template>
    <UButton label="Download All" :disabled="downloading" @click="tcArtifactsStore.downloadAll()">
        <template #leading>
            <template v-if="downloading">
                <UIcon :name="AppDesign.Icons.Loading" class="size-5 animate-spin" />
            </template>
            <template v-else>
                <UIcon :name="AppDesign.Icons.ActionDownload" class="size-5" />
            </template>
        </template>
    </UButton>
</template>

<script setup lang="ts">
import { AppDesign } from "~/design/AppDesign.js";
import { useTcArtifactsStore } from "~/store/TcArtifactsStore.js";

const tcArtifactsStore = useTcArtifactsStore();

const downloading = computed(() => tcArtifactsStore.activeDownloads.size > 0);
</script>

<style scoped></style>
