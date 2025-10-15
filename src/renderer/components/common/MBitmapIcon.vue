<template>
    <img class="size-5" :src="`./icons/${props.name}.png`" />
</template>

<script setup lang="ts">
const props = defineProps<{ name: string }>();
</script>

<style scoped></style>
