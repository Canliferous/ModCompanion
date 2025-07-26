<template>
    <UFormField label="MCA File" class="col-span-2">
        <UInput disabled v-model="asset.defFilePath" class="w-full" size="xs" />
        <template #hint>
            <div class="flex gap-1">
                <UButton
                    size="xs"
                    color="neutral"
                    variant="subtle"
                    label="Open"
                    icon="tdesign:file-code-1"
                    @click="handleOpen"
                />
                <UButton
                    size="xs"
                    color="neutral"
                    variant="subtle"
                    label="Explore to"
                    @click="handleExplore"
                    icon="tdesign:folder-1"
                />
            </div>
        </template>
    </UFormField>
</template>

<script setup lang="ts">
import { SharedAsset } from "Shared/SharedAssetDefinition.js";
import { exploreToMca, openMca } from "~/helper/AssetHelper.js";

const props = defineProps<{ asset: SharedAsset }>();

function handleOpen() {
    openMca(props.asset);
}

function handleExplore() {
    exploreToMca(props.asset);
}
</script>

<style scoped></style>
