<template>
    <MPanelRoot>
        <div class="grid gap-2">
            <UFormField label="Group Name">
                <template #hint>
                    <UBadge
                        label="Saved"
                        :icon="AppDesign.Icons.Check"
                        color="success"
                        class="transition-opacity opacity-0"
                        :class="{ 'opacity-100': savedIndicatorShown }"
                    />
                </template>
                <UInput
                    v-model="displayName"
                    placeholder="Group Name..."
                    class="w-full"
                    @change="handleUpdateDisplayName"
                />
            </UFormField>

            <UFormField label="Assets">
                <GroupList :group="group" @remove="handleRemoveAsset" @add="handleAddAsset" />

                <div class="flex mt-2">
                    <UButton label="Convert All" :icon="AppDesign.Icons.ActionConvertAsset" @click="handleConvertAll" />
                </div>
            </UFormField>

            <div>
                <UButton label="Delete Group" :icon="AppDesign.Icons.ActionRemove" @click="handleDelete" />
            </div>
        </div>
    </MPanelRoot>
</template>

<script setup lang="ts">
import { useAssetGroupsStore } from "~/store/AssetGroupsStore.js";
import { AppDesign } from "~/design/AppDesign.js";
import { useAssetConversionStore } from "~/store/AssetConversionStore.js";
import * as Shared from "mod_companion_shared";

const groupStore = useAssetGroupsStore();

const props = defineProps<{
    group: Shared.AssetGroup.SharedAssetGroup;
}>();

const displayName = ref(props.group.def.displayName);
watch(
    () => props.group.def.displayName,
    (value) => {
        displayName.value = value;
    },
);

function handleUpdateDisplayName() {
    groupStore.writeGroup(props.group.id, { ...toRaw(props.group.def), displayName: displayName.value });
}

function handleRemoveAsset(index: number) {
    const assets = [...props.group.def.assets];
    assets.splice(index, 1);
    groupStore.writeGroup(props.group.id, { ...toRaw(props.group.def), assets });
}

function handleAddAsset(ids: Shared.Asset.AssetId[]) {
    groupStore.writeAddAssetsToGroup(props.group.id, ids);
}

function handleDelete() {
    groupStore.deleteGroup(props.group.id);
}

const savedIndicatorShown = ref(false);
const savedIndicatorTimeoutHandle = ref<any | undefined>(undefined);
groupStore.subscribeGroupsWritten(() => {
    savedIndicatorShown.value = true;
    if (savedIndicatorTimeoutHandle.value !== undefined) {
        clearTimeout(savedIndicatorTimeoutHandle.value);
    }
    savedIndicatorTimeoutHandle.value = setTimeout(() => (savedIndicatorShown.value = false), 2000);
});

function handleConvertAll() {
    for (const asset of props.group.def.assets) {
        useAssetConversionStore().enqueue(asset);
    }
}
</script>

<style scoped></style>
