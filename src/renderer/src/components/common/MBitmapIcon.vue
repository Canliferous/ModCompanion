<template>
    <img class="size-5 shrink-0" :src="`./img/icons/${props.name}.png`" />
</template>

<script setup lang="ts">
const props = defineProps<{ name: string }>();
</script>

<style scoped></style>
