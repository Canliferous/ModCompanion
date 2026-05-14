<template>
    <button
        class="w-full h-8 outline-none cursor-text bg-neutral-900 border border-accented rounded inset-shadow-cave"
        @click="handleBgClicked()"
    >
        <FileBrowserLocationBarBreadcrumbs v-if="showBreadcrumbs" v-model="model" @clear-search="emit('clearSearch')" />
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
import * as Shared from "mod_companion_shared";

const model = defineModel<string>();

const showBreadcrumbs = ref(true);
const inputText = ref("");

const emit = defineEmits<{
    focusList: [void];
    clearSearch: [void];
}>();

function handleBgClicked(): void {
    showBreadcrumbs.value = false;
    inputText.value = model.value ?? "";
}

function handleBlur(): void {
    finish();
}

function handleEnter(event: KeyboardEvent): void {
    finish();
    event.stopPropagation();
}

function handleDown(event: KeyboardEvent): void {
    emit("focusList");
    event.stopPropagation();
}

function finish() {
    showBreadcrumbs.value = true;
    model.value = Shared.SourceFs.forwardSlashed(inputText.value);
}
</script>

<style scoped></style>
