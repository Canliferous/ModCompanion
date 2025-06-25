<script setup lang="ts">
import { useClipboard } from "@vueuse/core";
import { watch } from "vue";
const props = defineProps<{ hash: string }>();

const { copy, copied } = useClipboard({ source: props.hash });

watch(copied, (newVal) => {
    if (newVal) {
        useToast().add({
            title: "Asset Hash copied to clipboard",
            color: "success",
            icon: "tdesign:check",
        });
    }
});
</script>

<template>
    <UTooltip text="Copy Asset Hash">
        <UButton
            size="sm"
            variant="ghost"
            :color="copied ? 'success' : 'neutral'"
            :disabled="copied"
            @click="copy()"
            class="font-mono"
            :label="hash.substring(0, 5)"
        />
    </UTooltip>
</template>

<style scoped></style>
