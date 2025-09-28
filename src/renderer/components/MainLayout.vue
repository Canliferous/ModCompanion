<template>
    <div class="grid main-layout h-screen">
        <div>
            <slot name="sidebar" />
        </div>
        <div class="h-full grid grid-cols-1 grid-rows-1 p-1">
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
