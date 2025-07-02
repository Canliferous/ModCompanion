<template>
    <div class="col-span-full mt-1 flex items-center">
        <div v-for="f in files">
            <UButton
                v-if="files.substanceDesigner"
                size="sm"
                variant="subtle"
                label="Open Substance Source"
                @click="open(files.substanceDesigner)"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { SharedAssetDefinitionAssociatedFiles } from "Shared/SharedAssetDefinition.js";
import { getAppConfig } from "~/renderer-config.js";
import pathe from "pathe";

const props = defineProps<{ files: SharedAssetDefinitionAssociatedFiles }>();

function open(file: string) {
    window.electronAPI.app.openFile(pathe.join(getAppConfig().rootPath, file));
}
</script>

<style scoped></style>
