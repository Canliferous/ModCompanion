<template>
    <div class="p-2 h-full flex items-stretch flex-col justify-stretch">
        <div v-if="$slots.header" class="pb-1">
            <slot name="header" />
        </div>
        <div
            class="grow pr-1"
            :class="noScroll ? 'overflow-y-hidden' : alwaysShowScroll ? 'overflow-y-scroll' : 'overflow-y-auto'"
        >
            <slot />
        </div>
        <div v-if="$slots.footer" class="pt-1">
            <slot name="footer" />
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    alwaysShowScroll?: boolean;
    noScroll?: boolean;
}>();
</script>

<style scoped></style>
