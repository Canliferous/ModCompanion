<template>
    <button
        class="grid col-span-full grid-cols-subgrid p-1 items-center justify-center border-b-1 border-accented hover:bg-accented cursor-pointer text-left"
    >
        <span class="text-xs font-mono">{{ asset.hash.substring(0, 5) }}</span>
        <span class="text-sm">{{ asset.displayName }}</span>
    </button>
</template>

<script setup lang="ts">
import { SharedAsset } from "../../../../shared/SharedAsset.js";

const props = defineProps<{ asset: SharedAsset }>();
</script>

<style scoped></style>
