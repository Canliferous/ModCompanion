<template>
    <div class="grid grid-cols-subgrid grid-rows-[1fr_auto] col-span-full items-center gap-x-2">
        <template v-if="asset === undefined">
            <div class="col-span-full flex items-center">
                <UIcon :name="AppDesign.Icons.Question" class="text-warning mx-2.5" />
                <span class="grow">Unknown asset</span>
                <UButton variant="ghost" color="error" :icon="AppDesign.Icons.ActionRemove" @click="emit('remove')" />
            </div>
        </template>
        <template v-else>
            <UButton
                color="neutral"
                variant="ghost"
                :label="asset.def.displayName ?? '(unknown)'"
                @click="handleClickAsset"
            >
                <template #leading>
                    <MAssetTypeIcon :type="asset.def.type" />
                </template>
            </UButton>

            <MConversionStateIcon :state="conversionStore.getState(asset.def.id)" />

            <UButton variant="ghost" color="error" :icon="AppDesign.Icons.ActionRemove" @click="emit('remove')" />

            <div class="col-span-full">
                <template v-if="asset.def.associatedFiles">
                    <template v-for="entry in Shared.Asset.AssociatedFilesEntries" :key="entry.field">
                        <template v-if="asset.def.associatedFiles[entry.field]">
                            <UButton color="neutral" variant="ghost" :icon="entry.icon" size="sm">
                                Open {{ entry.name }}
                            </UButton>
                        </template>
                    </template>
                </template>
            </div>
        </template>
    </div>
</template>

<script setup lang="ts">
import { useAssetListStore } from "~/store/AssetListStore.js";
import { useAssetGroupsStore } from "~/store/AssetGroupsStore.js";
import { useAssetConversionStore } from "~/store/AssetConversionStore.js";
import { AppDesign } from "~/design/AppDesign.js";
import * as Shared from "mod_companion_shared";

const groupsStore = useAssetGroupsStore();
const listStore = useAssetListStore();
const conversionStore = useAssetConversionStore();

const props = defineProps<{
    assetId: Shared.Asset.AssetId;
    groupId: Shared.AssetGroup.GroupId;
}>();

const emit = defineEmits<{
    remove: [void];
}>();

const asset = computed(() => listStore.getAssetById(props.assetId));

function handleClickAsset() {
    groupsStore.expand(props.groupId);
    listStore.activate(props.assetId);
}
</script>

<style scoped></style>
