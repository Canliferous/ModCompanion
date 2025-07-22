<template>
    <template v-for="f in files">
        <template v-if="files.substanceDesigner">
            <UTooltip :text="files.substanceDesigner">
                <UButton
                    size="sm"
                    variant="subtle"
                    color="neutral"
                    label="Open Substance Source"
                    @click="open(files.substanceDesigner)"
                />
            </UTooltip>
        </template>
    </template>
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
