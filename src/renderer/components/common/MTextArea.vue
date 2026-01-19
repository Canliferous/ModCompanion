<template>
    <div
        class="h-full p-1 bg-neutral-900 border border-accented rounded inset-shadow-cave overflow-y-scroll overflow-x-clip"
        :class="{ 'overflow-x-scroll': horizScroll }"
    >
        <pre
            class="whitespace-pre-wrap text-xs text-neutral-300"
            :class="{ 'wrap-break-word': !horizScroll }"
        ><slot /></pre>
    </div>
</template>

<script setup lang="ts">
defineProps<{ horizScroll?: boolean }>();
</script>

<style scoped></style>
