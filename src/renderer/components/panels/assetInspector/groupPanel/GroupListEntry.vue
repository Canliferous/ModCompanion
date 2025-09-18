<template>
    <div class="flex">
        <div class="grow px-2.5 py-1.5">
            {{ asset?.def.displayName ?? "(unknown)" }}
        </div>
        <UButton variant="ghost" color="error" icon="tdesign:remove" @click="emit('remove')" />
    </div>
</template>

<script setup lang="ts">
import { SharedAssetId } from "Shared/SharedAssetDefinition.js";
import { useAssetListStore } from "~/store/AssetListStore.js";

const listStore = useAssetListStore();

const props = defineProps<{
    assetId: SharedAssetId;
}>();

const emit = defineEmits<{
    remove: [void];
}>();

const asset = computed(() => listStore.getAssetById(props.assetId));
</script>

<style scoped></style>
