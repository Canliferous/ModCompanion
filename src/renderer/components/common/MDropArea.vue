<template>
    <MAcceptDrop @change="(c) => emit('change', c)">
        <template slot="default" v-slot="{ isOverDropZone }">
            <div
                class="rounded transition-colors grid place-items-center bg-neutral-900 border border-accented inset-shadow-cave overflow-hidden _stack"
            >
                <MDropAreaBg :class="{ 'bg-neutral-800': isOverDropZone }" />
                <span class="text-neutral-300 text-center my-1.5 select-none">Drop here</span>
            </div>
        </template>
    </MAcceptDrop>
</template>

<script lang="ts" setup>
import MDropAreaBg from "~/components/common/MDropAreaBg.vue";

const emit = defineEmits<{ change: [string] }>();
</script>

<style scoped>
._stack {
    grid-template-areas: "stack";
}

._stack > * {
    grid-area: stack;
}
</style>
