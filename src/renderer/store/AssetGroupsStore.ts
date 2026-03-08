import { defineStore } from "pinia";
import { useRememberWorkspaceRef } from "~/composables/useRemember.js";
import { useAssetListStore } from "~/store/AssetListStore.js";
import { getCommonPrefix, removeTrailing } from "~/helper/StringHelper.js";
import * as Shared from "mod_companion_shared";

export const useAssetGroupsStore = defineStore("asset-groups", () => {
    const groups = ref<Map<Shared.AssetGroup.GroupId, Shared.AssetGroup.SharedAssetGroup>>(new Map());
    const expandedState = useRememberWorkspaceRef(ref<Shared.AssetGroup.GroupId[]>([]), "groups-expanded");
    const activeGroupId = ref<Shared.AssetGroup.GroupId | undefined>();
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

    type GroupsWrittenFunc = (groupId: Shared.AssetGroup.GroupId) => void;
    const groupsWrittenSubscribers: GroupsWrittenFunc[] = [];
    function subscribeGroupsWritten(func: GroupsWrittenFunc) {
        groupsWrittenSubscribers.push(func);
    }
    function notifyGroupsWritten(groupId: Shared.AssetGroup.GroupId) {
        for (const sub of groupsWrittenSubscribers) {
            sub(groupId);
        }
    }

    async function createGroup(assetIds: Shared.Asset.AssetId[]) {
        const assets = useAssetListStore().getAssetsById(assetIds);
        const displayNames = assets.map((a) => a.def.displayName).filter((n) => n !== undefined);
        const prefix = removeTrailing(getCommonPrefix(displayNames), "_");
        let groupName = `New Group (${assetIds.length} assets)`;
        if (prefix) {
            groupName = prefix;
        }
        const newGroup = { displayName: groupName, assets: assetIds };

        const result = await window.electronAPI.assetGroups.create(newGroup);
        groups.value.set(result.id, result);
    }

    function deleteGroup(id: Shared.AssetGroup.GroupId) {
        window.electronAPI.assetGroups.delete(id);
        groups.value.delete(id);
    }

    function refresh(): void {
        window.electronAPI.assetGroups.forceRescan();
    }

    function activateGroup(id: Shared.AssetGroup.GroupId | undefined): void {
        activeGroupId.value = id;
    }

    async function writeGroup(id: Shared.AssetGroup.GroupId, groupDef: Shared.AssetGroup.SharedAssetGroupDefinition): Promise<void> {
        const result = await window.electronAPI.assetGroups.update(id, groupDef);
        groups.value.set(result.id, result);
        notifyGroupsWritten(id);
    }

    async function writeAddAssetsToGroup(groupId: Shared.AssetGroup.GroupId, assetIds: Shared.Asset.AssetId[]): Promise<void> {
        const group = groups.value.get(groupId);
        if (group === undefined) return;

        const assets: Shared.Asset.AssetId[] = Array.from(new Set([...group.def.assets, ...assetIds]));
        return writeGroup(group.id, { ...toRaw(group.def), assets });
    }

    async function writeRemoveAssetsFromGroup(groupId: Shared.AssetGroup.GroupId, assetIds: Shared.Asset.AssetId[]): Promise<void> {
        const group = groups.value.get(groupId);
        if (group === undefined) return;

        for (const assetId of assetIds) {
            const index = group.def.assets.indexOf(assetId);
            if (index >= 0) {
                group.def.assets.splice(index, 1);
            }
        }

        return writeGroup(group.id, group.def);
    }

    async function writeRemoveAssetsFromTheirGroups(assetIds: Shared.Asset.AssetId[]): Promise<void> {
        const groupIds = new Map<Shared.AssetGroup.GroupId, Shared.Asset.AssetId[]>();
        for (const assetId of assetIds) {
            const groupId = useAssetGroupsStore().getGroupFromAssetId(assetId)?.id;
            if (groupId) {
                if (!groupIds.has(groupId)) {
                    groupIds.set(groupId, [assetId]);
                } else {
                    groupIds.get(groupId)?.push(assetId);
                }
            }
        }
        await Promise.allSettled(
            groupIds.entries().map(([key, val]) => useAssetGroupsStore().writeRemoveAssetsFromGroup(key, val)),
        );
    }

    function isGrouped(assetId: Shared.Asset.AssetId) {
        for (const group of groups.value.values()) {
            if (group.def.assets.includes(assetId)) return true;
        }

        return false;
    }

    function getGroupFromAssetId(assetId: Shared.Asset.AssetId): Shared.AssetGroup.SharedAssetGroup | undefined {
        for (const group of groups.value.values()) {
            if (group.def.assets.includes(assetId)) return group;
        }
        return undefined;
    }

    function getGroup(groupId: Shared.AssetGroup.GroupId): Shared.AssetGroup.SharedAssetGroup | undefined {
        return groups.value.get(groupId);
    }

    function isExpanded(groupId: Shared.AssetGroup.GroupId) {
        return expandedState.value.includes(groupId);
    }

    function isCollapsedAsset(assetId: Shared.Asset.AssetId) {
        const id = getGroupFromAssetId(assetId)?.id;
        if (id === undefined) return false;
        return !isExpanded(id);
    }

    function collapse(assetId: Shared.AssetGroup.GroupId) {
        const idx = expandedState.value.indexOf(assetId);
        if (idx >= 0) {
            const newState = [...expandedState.value];
            newState.splice(idx, 1);
            expandedState.value = newState;
        }
    }

    function expand(assetId: Shared.AssetGroup.GroupId) {
        if (!isExpanded(assetId)) {
            const newState = [...expandedState.value];
            newState.push(assetId);
            expandedState.value = newState;
        }
    }

    function toggleCollapsed(assetId: Shared.AssetGroup.GroupId) {
        const newState = [...expandedState.value];
        const idx = newState.indexOf(assetId);
        if (idx >= 0) {
            newState.splice(idx, 1);
        } else {
            newState.push(assetId);
        }
        expandedState.value = newState;
    }

    function collapseAll() {
        expandedState.value = [];
    }

    function expandAll() {
        expandedState.value = Array.from(groups.value.keys());
    }

    return {
        groups,
        activeGroupId,
        activeGroup,
        expandedState,
        isExpanded,
        isCollapsedAsset,
        createGroup,
        refresh,
        activateGroup,
        writeGroup,
        writeAddAssetsToGroup,
        writeRemoveAssetsFromGroup,
        writeRemoveAssetsFromTheirGroups,
        isGrouped,
        toggleCollapsed,
        collapse,
        expand,
        subscribeGroupsWritten,
        deleteGroup,
        collapseAll,
        expandAll,
        getGroupFromAssetId,
        getGroup,
    };
});
