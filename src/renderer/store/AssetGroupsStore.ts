import { defineStore } from "pinia";
import { SharedAssetGroup, SharedAssetGroupDefinition, SharedAssetGroupId } from "Shared/SharedAssetGroup.js";
import { SharedAssetId } from "Shared/SharedAssetDefinition.js";

export const useAssetGroupsStore = defineStore("asset-groups", () => {
    const groups = ref<Map<SharedAssetGroupId, SharedAssetGroup>>(new Map());
    const activeGroupId = ref<SharedAssetGroupId | undefined>();
    const activeGroup = computed(() => {
        const v = activeGroupId.value;
        if (!v) {
            return undefined;
        } else {
            return groups.value.get(v);
        }
    });

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

    function activateGroup(id: SharedAssetGroupId | undefined): void {
        activeGroupId.value = id;
    }

    async function writeGroup(id: SharedAssetGroupId, groupDef: SharedAssetGroupDefinition) {
        const result = await window.electronAPI.assetGroups.update(id, groupDef);
        groups.value.set(result.id, result);
    }

    function writeAddAssetsToGroup(groupId: SharedAssetGroupId, assetIds: SharedAssetId[]) {
        const group = groups.value.get(groupId);
        if (group === undefined) return;

        const assets: SharedAssetId[] = Array.from(new Set([...group.def.assets, ...assetIds]));
        return writeGroup(group.id, { ...toRaw(group.def), assets });
    }

    function isGrouped(assetId: SharedAssetId) {
        for (const group of groups.value.values()) {
            if (group.def.assets.includes(assetId)) return true;
        }

        return false;
    }

    return {
        groups,
        activeGroupId,
        activeGroup,
        createGroup,
        forceRefresh,
        activateGroup,
        writeGroup,
        writeAddAssetsToGroup,
        isGrouped,
    };
});
