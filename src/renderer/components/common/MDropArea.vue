<template>
    <MAcceptDrop @change="(c) => emit('change', c)">
        <template slot="default" v-slot="{ isOverDropZone }">
            <div
                class="rounded transition-colors grid place-items-center bg-neutral-900 border border-accented inset-shadow-cave _stack"
                :class="{ 'bg-neutral-700': isOverDropZone }"
            >
                <div
                    class="w-full h-full bg-radial from-neutral-700 from-8% to-transparent to-10% bg-size-[9px_9px] bg-center transition-colors"
                />
                <span class="text-neutral-300 text-center my-1.5 select-none">Drop here</span>
            </div>
        </template>
    </MAcceptDrop>
</template>

<script lang="ts" setup>
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
