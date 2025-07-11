<template>
    <div>
        <button @click="handleBgClicked()" class="w-full outline-none">
            <FsBreadcrumbs v-if="showBreadcrumbs" />
            <UInput
                v-else
                size="sm"
                class="w-full"
                variant="none"
                ref="input"
                @blur="handleBlur()"
                v-model="inputText"
                autofocus
                @keydown="handleTextChange"
            />
        </button>
    </div>
</template>

<script setup lang="ts">
import { useLooseFilesStore } from "~/store/LooseFilesStore.js";

const showBreadcrumbs = ref(true);
const inputText = ref("");

const input = useTemplateRef("input");
function handleBgClicked(): void {
    showBreadcrumbs.value = false;
    inputText.value = useLooseFilesStore().currentDir;
}

function handleBlur(): void {
    _finish();
}

function handleTextChange(event: KeyboardEvent): void {
    if (event.key === "enter") {
        _finish();
    }
}

function _finish() {
    showBreadcrumbs.value = true;
    useLooseFilesStore().updateCurrentDir(inputText.value);
}
</script>

<style scoped></style>
