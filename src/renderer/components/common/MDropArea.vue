<template>
    <div
        class="rounded transition-colors grid place-items-center bg-neutral-900 border border-accented inset-shadow-cave _stack"
        :class="{ 'bg-neutral-850': dragOver }"
    >
        <div
            class="w-full h-full bg-radial from-neutral-700 from-8% to-transparent to-10% bg-size-[8px_8px] bg-center transition-colors"
        />
        <span class="text-neutral-300 text-center my-3 select-none">Drop here</span>
    </div>
</template>

<script lang="ts" setup>
defineProps<{
    dragOver?: boolean;
}>();
</script>

<style scoped>
._stack {
    grid-template-areas: "stack";
}

._stack > * {
    grid-area: stack;
}
</style>
