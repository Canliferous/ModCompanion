<template>
    <TooltipProvider>
        <template v-if="props.model">
            <slot />
        </template>
        <div v-else class="h-full p-10 grid place-items-center text-center">
            This panel's data model couldn't be found.<br />
            Should never ever happen, report it right away
        </div>
    </TooltipProvider>
</template>

<script setup lang="ts">
import { TooltipProvider } from "reka-ui";
import { PanelModel } from "~/helper/GlobalComponents.js";
const props = defineProps<{ model?: PanelModel }>();
</script>

<style scoped></style>
