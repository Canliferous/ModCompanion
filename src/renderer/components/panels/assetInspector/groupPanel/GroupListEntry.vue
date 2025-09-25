<template>
    <div class="grid grid-cols-subgrid grid-rows-2 col-span-full items-center gap-2">
        <template v-if="asset === undefined">
            <div class="col-span-full text-center">Unknown asset</div>
        </template>
        <template v-else>
            <AssetTypeIcon :type="asset.def.type" class="ml-2" />
            <div>
                {{ asset.def.displayName ?? "(unknown)" }}
            </div>
            <UButton variant="ghost" color="error" icon="tdesign:remove" @click="emit('remove')" />
            <div>
                <template v-if="asset.def.associatedFiles" v-for="assoc in asset.def.associatedFiles">
                    <template v-if="assoc !== undefined">
                        <GroupEntryAssociatedFile
                            :associated-files-key="assoc as keyof SharedAssetDefinitionAssociatedFiles"
                        />
                    </template>
                </template>
            </div>
        </template>
    </div>
</template>

<script setup lang="ts">
import {
    getAssociatedEntryName,
    SharedAssetDefinitionAssociatedFiles,
    SharedAssetId,
} from "Shared/SharedAssetDefinition.js";
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
