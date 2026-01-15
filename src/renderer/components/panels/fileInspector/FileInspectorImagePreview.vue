<template>
    <div>
        <img :src="`file://${path}`" />
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{ path: string }>();
</script>

<style scoped></style>
