<template>
    <div class="p-2 grid grid-cols-2">
        <UFormField label="Group Name">
            <UInput
                placeholder="Group Name..."
                class="w-full"
                v-model="displayName"
                @change="handleUpdateDisplayName"
            />
        </UFormField>
    </div>
</template>

<script setup lang="ts">
import { SharedAssetGroup } from "Shared/SharedAssetGroup.js";
import { useAssetGroupsStore } from "~/store/AssetGroupsStore.js";

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
</script>

<style scoped></style>
