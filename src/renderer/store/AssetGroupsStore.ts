import { defineStore } from "pinia";
import { SharedAssetGroupDefinition } from "Shared/SharedAssetGroup.js";
import { SharedAssetId } from "Shared/SharedAssetDefinition.js";

export const useAssetGroupsStore = defineStore("asset-groups", () => {
    const groups = ref<SharedAssetGroupDefinition[]>([]);

    function createGroup(assets: SharedAssetId[]) {
        const newGroup = { displayName: `New Group (${assets.length} assets)`, assets };

        groups.value.push(newGroup);
        window.electronAPI.assetGroups.create(newGroup);
    }

    return { groups, createGroup };
});
