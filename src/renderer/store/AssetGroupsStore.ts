import { defineStore } from "pinia";
import { SharedAssetGroup, SharedAssetGroupId } from "Shared/SharedAssetGroup.js";
import { SharedAssetId } from "Shared/SharedAssetDefinition.js";

export const useAssetGroupsStore = defineStore("asset-groups", () => {
    const groups = ref<Map<SharedAssetGroupId, SharedAssetGroup>>(new Map());
    const selectedGroup = ref<SharedAssetGroupId | undefined>();

    window.electronAPI.assetGroups.subscribeRescanned((event) => {
        groups.value = event.groups;
    });

    async function createGroup(assets: SharedAssetId[]) {
        const newGroup = { displayName: `New Group (${assets.length} assets)`, assets };

        const result = await window.electronAPI.assetGroups.create(newGroup);
        groups.value.set(result.id, result);
    }

    function forceRefresh(): void {
        window.electronAPI.assetGroups.forceRescan();
    }

    function selectGroup(id: SharedAssetGroupId | undefined): void {
        selectedGroup.value = id;
    }

    return { groups, selectedGroup, createGroup, forceRefresh, selectGroup };
});
