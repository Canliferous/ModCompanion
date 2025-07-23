<template>
    <div class="p-1 grid main-layout gap-1 h-screen">
        <div class="">
            <slot name="sidebar" />
        </div>
        <div class="h-full grid grid-cols-1 grid-rows-1">
            <slot name="page" />
        </div>
    </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.main-layout {
    grid-template-columns: 10rem minmax(0, 1fr);
    grid-template-rows: minmax(0, 1fr);
}
</style>
