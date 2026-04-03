<template>
    <button
        class="w-full h-8 outline-none cursor-text bg-neutral-900 border border-accented rounded inset-shadow-cave"
        @click="handleBgClicked()"
    >
        <FileBrowserLocationBarBreadcrumbs v-if="showBreadcrumbs" />
        <UInput
            v-else
            v-model="inputText"
            size="sm"
            class="w-full"
            variant="none"
            autofocus
            @blur="handleBlur()"
            @keydown.enter="handleEnter"
            @keydown.down="handleDown"
        />
    </button>
</template>

<script setup lang="ts">
import { useFileBrowserStore } from "~/store/FileBrowserStore.js";
import * as Shared from "mod_companion_shared";

const fileBrowserStore = useFileBrowserStore();

const showBreadcrumbs = ref(true);
const inputText = ref("");

const emit = defineEmits<{
    focusList: [void];
}>();

function handleBgClicked(): void {
    showBreadcrumbs.value = false;
    inputText.value = fileBrowserStore.currentDir;
}

function handleBlur(): void {
    _finish();
}

function handleEnter(event: KeyboardEvent): void {
    _finish();
    event.stopPropagation();
}

function handleDown(event: KeyboardEvent): void {
    emit("focusList");
    event.stopPropagation();
}

function _finish() {
    showBreadcrumbs.value = true;
    fileBrowserStore.setCurrentDir(Shared.SourceFs.forwardSlashed(inputText.value));
}
</script>

<style scoped></style>
