<template>
    <div class="grid grid-cols-subgrid col-span-full gap-1 bg-neutral-850 py-1 px-2 h-full inset-shadow-rim">
        <div class="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
            <div>
                <USeparator orientation="vertical" />
                <FooterLog />
            </div>
            <div class="flex items-center gap-2">
                <USeparator orientation="vertical" />
                <FooterTcArtifactsStatus />
                <USeparator orientation="vertical" />
                <FooterConversionStatus />
                <USeparator orientation="vertical" />
                <FooterInteropStatus />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import FooterConversionStatus from "~/components/footer/FooterConversionStatus.vue";
import FooterLog from "~/components/footer/FooterLog.vue";
import TopbarModcompButton from "~/components/topbar/TopbarModcompButton.vue";
</script>

<style scoped></style>
