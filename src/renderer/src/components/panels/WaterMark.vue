<template>
    <div class="w-full h-full relative grid place-items-center">
        <div class="rounded-xl inset-shadow-cave bg-neutral-950 px-10 py-10 grid gap-7">
            <div class="font-semibold text-center select-none">Add Panel</div>

            <MAddPanelsGrid button-size="xl" />
        </div>
    </div>
</template>

<script setup lang="ts">
import MAddPanelsGrid from "~/components/common/MAddPanelsGrid.vue";
</script>

<style scoped></style>
