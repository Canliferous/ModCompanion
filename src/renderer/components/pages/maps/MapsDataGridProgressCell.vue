<template>
    <div class="flex justify-center">
        <UIcon name="lucide:dot" v-if="state === SharedMapCompileState.Idle" />
        <UIcon
            name="tdesign:loading"
            class="text-info animate-spin"
            v-if="state === SharedMapCompileState.InProgress"
        />
        <UIcon name="tdesign:check" class="text-success" v-if="state === SharedMapCompileState.Completed" />
    </div>
</template>

<script setup lang="ts">
import { SharedMapCompileState, SharedMapCompileStep } from "../../../../shared/SharedMapCompile.js";
import { useMapCompileStore } from "../../../store/MapCompileStore.js";
import { computed } from "vue";

const props = defineProps<{ mapPath: string; step: SharedMapCompileStep }>();
const key = props.mapPath + props.step;

const compileStore = useMapCompileStore();

const state = computed<SharedMapCompileState>(() => {
    const p = compileStore.progress.get(key);
    if (!p) return SharedMapCompileState.Idle;

    return p;
});
</script>

<style scoped></style>
