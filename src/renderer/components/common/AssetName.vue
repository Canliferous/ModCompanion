<script setup lang="ts">
import { useClipboard } from "@vueuse/core";
import { watch } from "vue";
import { SharedAssetType } from "Shared/SharedAssetDefinition.js";
import AssetTypeIcon from "~/components/common/AssetTypeIcon.vue";

const props = defineProps<{ name: string; type?: SharedAssetType }>();

const { copy, copied } = useClipboard({ source: props.name });

watch(copied, (newVal) => {
    if (newVal) {
        useToast().add({
            title: "Asset Name copied to clipboard",
            color: "success",
            icon: "tdesign:check",
        });
    }
});
</script>

<template>
    <UTooltip text="Copy Asset Name">
        <UButton
            size="sm"
            variant="ghost"
            :color="copied ? 'success' : 'neutral'"
            :disabled="copied"
            @click="copy()"
            class="font-mono"
            :label="name"
            :leading="type !== SharedAssetType.Unknown"
        >
            <template #leading>
                <AssetTypeIcon v-if="type" :type="type" class="size-4" />
            </template>
        </UButton>
    </UTooltip>
</template>

<style scoped></style>
