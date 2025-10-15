<template>
    <div class="flex justify-center">
        <UIcon :name="AppDesign.Icons.MapCompileIdle" v-if="state === SharedMapCompileState.Idle" />
        <UIcon
            :name="AppDesign.Icons.MapCompileInProgress"
            class="text-info animate-spin"
            v-if="state === SharedMapCompileState.InProgress"
        />
        <UIcon
            :name="AppDesign.Icons.MapCompileCompleted"
            class="text-success"
            v-if="state === SharedMapCompileState.Completed"
        />
    </div>
</template>

<script setup lang="ts">
import { SharedMapCompileState, SharedMapCompileStep } from "Shared/SharedMapCompile.js";
import { useMapCompileStore } from "~/store/MapCompileStore.js";
import { computed } from "vue";
import { AppDesign } from "~/design/AppDesign.js";

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
