<template>
    <div class="flex justify-center">
        <UIcon v-if="state === CompileState.Idle" :name="AppDesign.Icons.MapCompileIdle" />
        <UIcon
            v-if="state === CompileState.InProgress"
            :name="AppDesign.Icons.MapCompileInProgress"
            class="text-info animate-spin"
        />
        <UIcon
            v-if="state === CompileState.Completed"
            :name="AppDesign.Icons.MapCompileCompleted"
            class="text-success"
        />
    </div>
</template>

<script setup lang="ts">
import { CompileState, SharedMapCompileStep } from "Shared/SharedMap.js";
import { useMapCompileStore } from "~/store/MapCompileStore.js";
import { computed } from "vue";
import { AppDesign } from "~/design/AppDesign.js";

const props = defineProps<{ mapPath: string; step: SharedMapCompileStep }>();
const key = props.mapPath + props.step;

const compileStore = useMapCompileStore();

const state = computed<CompileState>(() => {
    const p = compileStore.progress.get(key);
    if (!p) return CompileState.Idle;

    return p;
});
</script>

<style scoped></style>
