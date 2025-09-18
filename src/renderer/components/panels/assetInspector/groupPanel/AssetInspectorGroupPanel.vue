<template>
    <div class="p-2 grid gap-2">
        <UFormField label="Group Name">
            <UInput
                placeholder="Group Name..."
                class="w-full"
                v-model="displayName"
                @change="handleUpdateDisplayName"
            />
        </UFormField>

        <UFormField label="Assets">
            <GroupList :group="group" @remove="handleRemoveAsset" @add="handleAddAsset" />
        </UFormField>
    </div>
</template>

<script setup lang="ts">
import { SharedAssetGroup } from "Shared/SharedAssetGroup.js";
import { useAssetGroupsStore } from "~/store/AssetGroupsStore.js";
import { SharedAssetId } from "Shared/SharedAssetDefinition.js";

const groupStore = useAssetGroupsStore();

const props = defineProps<{
    group: SharedAssetGroup;
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

function handleAddAsset(ids: SharedAssetId[]) {
    const assets: SharedAssetId[] = Array.from(new Set([...props.group.def.assets, ...ids]));
    groupStore.writeGroup(props.group.id, { ...toRaw(props.group.def), assets });
}
</script>

<style scoped></style>
