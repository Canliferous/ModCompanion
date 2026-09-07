<template>
    <div class="w-full h-full grid grid-cols-1 grid-rows-1 p-4 overflow-hidden">
        <div
            class="w-full h-full grid grid-cols-1 sm:grid-cols-[minmax(30rem,minmax(0m1fr))_minmax(minmax(0m1fr),10rem)] md:grid-cols-[minmax(30rem,minmax(0m1fr))_minmax(minmax(0m1fr),25rem)] grid-rows-[10rem_minmax(0,1fr)] bg-neutral-850 rounded-3xl"
        >
            <!-- Positioned before all other elements so it remains in the background -->
            <img
                class="col-start-2 row-start-1 row-end-3 self-end justify-self-end max-h-10/12 lg:max-h-full hidden sm:block"
                src="/img/art/utylity_watermark.png"
            />

            <div class="col-start-1 col-end-3 row-start-1 px-10 lg:px-20 my-auto">
                <h1
                    class="text-3xl sm:text-5xl md:text-7xl text-magenta-400 font-puff font-bold text-shadow-watermark-logo text-nowrap"
                >
                    MOD COMPANION
                </h1>
                <span class="text-xl font-puff text-shadow-lg/50">A modder's best friend</span>
            </div>

            <nav
                class="col-start-1 row-start-2 row-end-3 max-w-200 self-end rounded-xl inset-shadow-cave bg-neutral-900 m-10 p-5 md:p-10 grid gap-4 md:gap-7"
            >
                <header class="font-semibold select-none text-magenta-300">Get started by adding a panel:</header>

                <div class="grid grid-cols-1 lg:grid-cols-2 gap-2">
                    <MAddPanelsGrid button-size="xl" />
                </div>
            </nav>
        </div>
    </div>
</template>

<script setup lang="ts">
import MAddPanelsGrid from "~/components/common/MAddPanelsGrid.vue";
</script>

<style scoped></style>
