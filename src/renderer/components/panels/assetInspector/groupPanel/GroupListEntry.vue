<template>
    <div class="grid grid-cols-subgrid grid-rows-[1fr_auto] col-span-full items-center gap-x-2">
        <template v-if="asset === undefined">
            <div class="col-span-full text-center">Unknown asset</div>
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
                    <template v-for="entry in SharedAssetDefinitionAssociatedFilesEntries">
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
import { SharedAssetDefinitionAssociatedFilesEntries, SharedAssetId } from "Shared/SharedAssetDefinition.js";
import { useAssetListStore } from "~/store/AssetListStore.js";
import { useAssetGroupsStore } from "~/store/AssetGroupsStore.js";
import { SharedAssetGroupId } from "Shared/SharedAssetGroup.js";
import { useAssetConversionStore } from "~/store/AssetConversionStore.js";
import { AppDesign } from "~/design/AppDesign.js";

const groupsStore = useAssetGroupsStore();
const listStore = useAssetListStore();
const conversionStore = useAssetConversionStore();

const props = defineProps<{
    assetId: SharedAssetId;
    groupId: SharedAssetGroupId;
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
