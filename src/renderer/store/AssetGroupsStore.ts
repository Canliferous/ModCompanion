import { defineStore } from "pinia";
import { SharedAssetGroup, SharedAssetGroupDefinition } from "Shared/SharedAssetGroup.js";
import { SharedAssetId } from "Shared/SharedAssetDefinition.js";

export const useAssetGroupsStore = defineStore("asset-groups", () => {
    const groups = ref<SharedAssetGroup[]>([]);

    window.electronAPI.assetGroups.subscribeRescanned((event) => {
        groups.value = event.groups;
    });

    async function createGroup(assets: SharedAssetId[]) {
        const newGroup = { displayName: `New Group (${assets.length} assets)`, assets };

        const result = await window.electronAPI.assetGroups.create(newGroup);
        groups.value.push(result);
    }

    function forceRefresh(): void {
        window.electronAPI.assetGroups.forceRescan();
    }

    return { groups, createGroup, forceRefresh };
});
