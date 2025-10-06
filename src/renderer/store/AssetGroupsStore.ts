import { defineStore } from "pinia";
import { SharedAssetGroup, SharedAssetGroupDefinition, SharedAssetGroupId } from "Shared/SharedAssetGroup.js";
import { SharedAssetId } from "Shared/SharedAssetDefinition.js";
import { useRememberWorkspaceRef } from "~/composables/useRemember.js";

export const useAssetGroupsStore = defineStore("asset-groups", () => {
    const groups = ref<Map<SharedAssetGroupId, SharedAssetGroup>>(new Map());
    const expandedState = useRememberWorkspaceRef(ref<SharedAssetGroupId[]>([]), "groups-expanded");
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

    type GroupsWrittenFunc = (groupId: SharedAssetGroupId) => void;
    const groupsWrittenSubscribers: GroupsWrittenFunc[] = [];
    function subscribeGroupsWritten(func: GroupsWrittenFunc) {
        groupsWrittenSubscribers.push(func);
    }
    function notifyGroupsWritten(groupId: SharedAssetGroupId) {
        for (let sub of groupsWrittenSubscribers) {
            sub(groupId);
        }
    }

    async function createGroup(assets: SharedAssetId[]) {
        const newGroup = { displayName: `New Group (${assets.length} assets)`, assets };

        const result = await window.electronAPI.assetGroups.create(newGroup);
        groups.value.set(result.id, result);
    }

    function deleteGroup(id: SharedAssetGroupId) {
        window.electronAPI.assetGroups.delete(id);
        groups.value.delete(id);
    }

    function refresh(): void {
        window.electronAPI.assetGroups.forceRescan();
    }

    function activateGroup(id: SharedAssetGroupId | undefined): void {
        activeGroupId.value = id;
    }

    async function writeGroup(id: SharedAssetGroupId, groupDef: SharedAssetGroupDefinition) {
        const result = await window.electronAPI.assetGroups.update(id, groupDef);
        groups.value.set(result.id, result);
        notifyGroupsWritten(id);
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

    function getGroupFromAssetId(assetId: SharedAssetId) {
        for (const group of groups.value.values()) {
            if (group.def.assets.includes(assetId)) return group;
        }
        return undefined;
    }

    function isExpanded(groupId: SharedAssetGroupId) {
        return expandedState.value.includes(groupId);
    }

    function isCollapsedAsset(assetId: SharedAssetId) {
        const id = getGroupFromAssetId(assetId)?.id;
        if (id === undefined) return false;
        return !isExpanded(id);
    }

    function collapse(assetId: SharedAssetGroupId) {
        const idx = expandedState.value.indexOf(assetId);
        if (idx >= 0) {
            const newState = [...expandedState.value];
            newState.splice(idx, 1);
            expandedState.value = newState;
        }
    }

    function expand(assetId: SharedAssetGroupId) {
        if (!isExpanded(assetId)) {
            const newState = [...expandedState.value];
            newState.push(assetId);
            expandedState.value = newState;
        }
    }

    function toggleCollapsed(assetId: SharedAssetGroupId) {
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
        isGrouped,
        toggleCollapsed,
        collapse,
        expand,
        subscribeGroupsWritten,
        deleteGroup,
        collapseAll,
        expandAll,
    };
});
