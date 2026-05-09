<template>
    <UInput
        ref="input"
        v-model="model"
        size="sm"
        class="w-full *:h-8"
        :icon="AppDesign.Icons.Search"
        placeholder="Search"
    >
        <template v-if="model" #trailing>
            <UButton :icon="AppDesign.Icons.Close" variant="link" size="xs" @click="handleClear" />
        </template>
    </UInput>
</template>
<script setup lang="ts">
import { AppDesign } from "~/design/AppDesign.js";
import { FileBrowserBehavior } from "~/components/panels/fileBrowser/FileBrowser.model.js";

const model = defineModel<string>();

const inputRef = useTemplateRef("input");

inject(FileBrowserBehavior.ShortcutsInjectKey)?.onFocusSearch.on(() => {
    inputRef.value?.inputRef?.focus();
});

function handleClear() {
    model.value = "";
}
</script>

<style scoped></style>
