<template>
    <TooltipProvider>
        <AssetBrowserRoot />
    </TooltipProvider>
</template>

<script setup lang="ts">
import { TooltipProvider } from "reka-ui";

interface GeneralSettings {
    smtpHost: string;
    smtpPort: string;
}

const props = defineProps<{ state: GeneralSettings }>();
</script>

<style scoped></style>
