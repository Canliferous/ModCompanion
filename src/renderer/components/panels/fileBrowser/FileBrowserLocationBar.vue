<template>
    <div>
        <button @click="handleBgClicked()" class="w-full outline-none">
            <FileBrowserBreadcrumbs v-if="showBreadcrumbs" />
            <UInput
                v-else
                size="sm"
                class="w-full"
                variant="none"
                @blur="handleBlur()"
                v-model="inputText"
                autofocus
                @keydown.enter="handleEnter"
                @keydown.down="handleDown"
            />
        </button>
    </div>
</template>

<script setup lang="ts">
import { useLooseFilesStore } from "~/store/LooseFilesStore.js";
import { forwardSlashed } from "Shared/SharedSourceFs.js";

const showBreadcrumbs = ref(true);
const inputText = ref("");

const emit = defineEmits<{
    focusList: [void];
}>();

function handleBgClicked(): void {
    showBreadcrumbs.value = false;
    inputText.value = useLooseFilesStore().currentDir;
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
    useLooseFilesStore().updateCurrentDir(forwardSlashed(inputText.value));
}
</script>

<style scoped></style>
