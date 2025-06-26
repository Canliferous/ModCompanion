<script setup lang="ts">
defineProps<{ converted: boolean }>();
</script>

<template>
    <div class="grid place-items-center">
        <UIcon v-if="converted" name="tdesign:check" class="text-success" />
        <UIcon v-if="!converted" name="tdesign:close" class="text-error" />
    </div>
</template>

<style scoped></style>
