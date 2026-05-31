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
import { watchDeep } from "@vueuse/core";

const props = defineProps<{ path: string }>();

const emit = defineEmits<{ hasChanged: [boolean] }>();

const model = ref<Shared.ChamberSignConfig.SharedChamberSignConfig | undefined>(undefined);

watch(
    () => props.path,
    async () => {
        const fileContents = await window.electronAPI.file.readString(
            props.path,
            Shared.FileBrowser.PathBases.Absolute,
        );
        if (!fileContents) {
            return;
        }

        const parsed = JSON.parse(fileContents);
        model.value = parsed;
    },
    { immediate: true },
);

watchDeep(model, () => {
    emit("hasChanged", true);
});

async function handleSave() {
    if (model.value) {
        await window.electronAPI.file.writeString(
            props.path,
            JSON.stringify(model.value, null, 4),
            Shared.FileBrowser.PathBases.Absolute,
        );
        window.electronAPI.hotReload.reloadChamberSignConfig();
    }
}
</script>

<style scoped></style>
