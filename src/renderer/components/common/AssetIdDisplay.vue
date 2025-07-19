<script setup lang="ts">
import { useClipboard } from "@vueuse/core";
import { watch } from "vue";
import { SharedAssetId } from "Shared/SharedAssetDefinition.js";
const props = defineProps<{ id: SharedAssetId }>();

const { copy, copied } = useClipboard({ source: props.id });

watch(copied, (newVal) => {
    if (newVal) {
        useToast().add({
            title: "Asset ID copied to clipboard",
            color: "success",
            icon: "tdesign:check",
        });
    }
});
</script>

<template>
    <UTooltip text="Copy Asset ID">
        <UButton
            size="sm"
            variant="ghost"
            :color="copied ? 'success' : 'neutral'"
            :disabled="copied"
            @click="copy()"
            class="font-mono"
            :label="id.substring(0, 5)"
        />
    </UTooltip>
</template>

<style scoped></style>
