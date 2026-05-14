<template>
    <div>
        <template v-if="model">
            <UButton label="Save" :icon="AppDesign.Icons.Save" @click="handleSave" />
            <ChamberSignConfigRoot v-model="model" />
        </template>
        <template v-else>
            <p>Invalid config</p>
        </template>
    </div>
</template>

<script setup lang="ts">
import { AppDesign } from "~/design/AppDesign.js";
import * as Shared from "mod_companion_shared";

const props = defineProps<{ path: string }>();

const model = ref<Shared.ChamberSignConfig.SharedChamberSignConfig | undefined>(undefined);

watch(
    () => props.path,
    async () => {
        const fileContents = await window.electronAPI.file.readString(
            props.path,
            Shared.FileBrowser.PathBases.Absolute,
        );
        const parsed = JSON.parse(fileContents);
        model.value = parsed;
    },
    { immediate: true },
);

async function handleSave() {
    if (model.value) {
        await window.electronAPI.file.writeString(
            props.path,
            JSON.stringify(model.value, null, 4),
            Shared.FileBrowser.PathBases.Absolute,
        );
    }
}
</script>

<style scoped></style>
