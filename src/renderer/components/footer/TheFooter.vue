<template>
    <div class="grid grid-cols-subgrid col-span-full gap-1 bg-neutral-850 py-1 px-2 h-full inset-shadow-rim">
        <FooterModcompButton />
        <div class="flex items-center gap-2">
            <USeparator orientation="vertical" />
            <FooterLog />
            <USeparator orientation="vertical" />
            <FooterConversionStatus />
            <USeparator orientation="vertical" />
            <FooterInteropStatus />
        </div>
    </div>
</template>

<script setup lang="ts">
import FooterConversionStatus from "~/components/footer/FooterConversionStatus.vue";
import FooterLog from "~/components/footer/FooterLog.vue";
import FooterModcompButton from "~/components/footer/FooterModcompButton.vue";
</script>

<style scoped></style>
