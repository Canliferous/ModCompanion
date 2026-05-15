<template>
    <div class="flex items-center select-none gap-0.5 overflow-x-hidden">
        <UButton
            size="sm"
            color="neutral"
            variant="ghost"
            class="text-muted"
            :icon="AppDesign.Icons.Home"
            @click="handleHomeClick"
        />
        <template v-for="(split, index) in pathSplits" :key="index">
            <span class="text-xs text-muted">/</span>
            <UButton
                :label="split"
                size="sm"
                color="neutral"
                variant="ghost"
                class="px-0 text-muted"
                @click="(event: MouseEvent) => handleClick(event, index + 1)"
            />
        </template>
    </div>
</template>

<script setup lang="ts">
import { AppDesign } from "~/design/AppDesign.js";

const model = defineModel<string>();
const emit = defineEmits<{ clearSearch: [void] }>();

const pathSplits = computed(() => {
    if (model.value === "/" || !model.value) {
        return [""];
    }
    return model.value?.split("/");
});

function handleClick(event: MouseEvent, index: number): void {
    event.stopPropagation();
    if (!pathSplits.value) {
        model.value = "";
        return;
    }

    let fullPath = "";
    for (let i = 0; i < index; i++) {
        if (i > 0) fullPath += "/";
        fullPath += pathSplits.value[i];
    }

    model.value = fullPath;
    emit("clearSearch");
}

function handleHomeClick(event: MouseEvent): void {
    event.stopPropagation();
    model.value = "/";
    emit("clearSearch");
}
</script>

<style scoped></style>
