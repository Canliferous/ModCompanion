<template>
    <UContextMenu :items="items">
        <MDataTable
            ref="table"
            :entries="entries"
            :columns="columns"
            :tree-child-func="treeChildFunc"
            draggable
            no-scroll
            neutral-highlight
            @on-active-changed="handleActiveChanged"
            @on-selection-changed="handleSelectionChanged"
            @on-drag-start="handleDragStart"
            @on-entry-activated="handleEntryActivated"
            @on-key-down="handleKeyDown"
        />
    </UContextMenu>
</template>

<script setup lang="ts">
import { useAssetListStore } from "~/store/AssetListStore.js";
import { DataTableColumn } from "~/components/common/dataTable/MDataTable.model.js";
import {
    getAssociatedEntryName,
    SharedAssetDefinitionAssociatedFiles,
    SharedAssetId,
} from "Shared/SharedAssetDefinition.js";
import { useAssetConversionStore } from "~/store/AssetConversionStore.js";
import { ContextMenuItem } from "@nuxt/ui/components/ContextMenu.vue.js";
import { exploreToMca, openAssociatedFile, openMca } from "~/helper/AssetHelper.js";
import AssetBrowserCellAssetName from "~/components/panels/assetBrowser/AssetBrowserCellAssetName.vue";
import AssetBrowserCellConverted from "~/components/panels/assetBrowser/AssetBrowserCellConverted.vue";
import { useAssetGroupsStore } from "~/store/AssetGroupsStore.js";
import {
    AssetBrowserAssetEntry,
    AssetBrowserEntry,
    AssetBrowserEntryTypes,
    getAssetBrowserEntrySortString,
    isAssetBrowserAssetEntry,
    isAssetBrowserGroupEntry,
} from "~/components/panels/assetBrowser/AssetBrowser.model.js";
import AssetBrowserCellGroupName from "~/components/panels/assetBrowser/AssetBrowserCellGroupName.vue";
import ClipboardHelper from "~/helper/ClipboardHelper.js";
import { summarizeConversionStates } from "~/helper/ConversionHelper.js";
import { AppDesign } from "~/design/AppDesign.js";
import { SharedAssetGroupId } from "Shared/SharedAssetGroup.js";

const listStore = useAssetListStore();
const conversionStore = useAssetConversionStore();
const assetGroupsStore = useAssetGroupsStore();

const table = useTemplateRef("table");

listStore.activateEvent.on((assetId) => {
    if (assetId === undefined) {
        table.value?.deactivate();
    } else {
        const group = assetGroupsStore.getGroupFromAssetId(assetId);
        if (group) {
            assetGroupsStore.expand(group.id);
        }
        table.value?.activate((entry) => isAssetBrowserAssetEntry(entry) && entry.assetDef.id === assetId);
    }
});

listStore.selectEvent.on((assetIds) => {
    if (assetIds.length === 0) {
        table.value?.deselect();
    } else {
        for (const assetId of assetIds) {
            const group = assetGroupsStore.getGroupFromAssetId(assetId);
            if (group) {
                assetGroupsStore.expand(group.id);
            }
        }
        table.value?.select((entry) => isAssetBrowserAssetEntry(entry) && assetIds.includes(entry.assetDef.id));
    }
});

const entries = computed(() => {
    const assetGroups = assetGroupsStore.groups;
    const assetIdsInGroups: SharedAssetId[] = [];

    // Add groups first
    const result: AssetBrowserEntry[] = [];
    for (const assetGroup of assetGroups.values()) {
        const searchTerm = listStore.searchTerm;
        if (searchTerm) {
            const passesSearch = assetGroup.def.displayName.includes(searchTerm);
            if (!passesSearch) {
                continue;
            }
        }

        result.push({
            type: AssetBrowserEntryTypes.Group,
            group: assetGroup,
        });

        assetIdsInGroups.push(...assetGroup.def.assets);
    }

    // Add remaining ungrouped assets
    for (const assets of listStore.filteredAssets) {
        if (assetIdsInGroups.includes(assets.def.id)) {
            continue;
        }

        result.push({
            type: AssetBrowserEntryTypes.Asset,
            assetDef: assets.def,
        });
    }

    result.sort((a, b) => getAssetBrowserEntrySortString(a).localeCompare(getAssetBrowserEntrySortString(b)));

    return result;
});

function treeChildFunc(entry: AssetBrowserEntry): AssetBrowserEntry[] | undefined {
    if (isAssetBrowserGroupEntry(entry)) {
        if (!assetGroupsStore.isExpanded(entry.group.id)) return undefined;

        const assets = listStore.getAssetsById(entry.group.def.assets);
        const entries = assets.map<AssetBrowserAssetEntry>((a) => ({
            type: AssetBrowserEntryTypes.Asset,
            assetDef: a.def,
        }));
        return entries;
    }

    return undefined;
}

const editingGroup = ref<SharedAssetGroupId | undefined>();
const editingAsset = ref<SharedAssetGroupId | undefined>();

function stopEditing() {
    editingAsset.value = undefined;
    editingGroup.value = undefined;
    nextTick(() => {
        table.value?.focus();
    });
}

const columns: DataTableColumn<AssetBrowserEntry>[] = [
    {
        id: "name",
        label: "Name",
        cell: (entry, depth) => {
            if (isAssetBrowserAssetEntry(entry)) {
                return h(AssetBrowserCellAssetName, {
                    id: entry.assetDef.id,
                    name: entry.assetDef.displayName ?? "(unknown)",
                    type: entry.assetDef.type,
                    depth,
                    editing: editingAsset.value === entry.assetDef.id,
                    onStopEditing: stopEditing,
                });
            } else if (isAssetBrowserGroupEntry(entry)) {
                return h(AssetBrowserCellGroupName, {
                    name: entry.group.def.displayName,
                    id: entry.group.id,
                    editing: editingGroup.value === entry.group.id,
                    onStopEditing: stopEditing,
                });
            }

            return undefined;
        },
        size: "minmax(0, 1fr)",
    },
    {
        id: "converted",
        label: "Conv",
        cell: (entry) => {
            if (isAssetBrowserAssetEntry(entry)) {
                const state = conversionStore.getState(entry.assetDef.id);
                return h(AssetBrowserCellConverted, { state });
            }

            if (isAssetBrowserGroupEntry(entry)) {
                const state = summarizeConversionStates(entry.group.def.assets.map(conversionStore.getState));
                return h(AssetBrowserCellConverted, { state });
            }
        },
        size: "auto",
    },
];

function handleSelectionChanged(entries: AssetBrowserEntry[]): void {
    listStore.selectedIds = entries.filter(isAssetBrowserAssetEntry).map((a) => a.assetDef.id);
}

function handleActiveChanged(entry: AssetBrowserEntry | undefined): void {
    if (isAssetBrowserAssetEntry(entry)) {
        listStore.activeId = entry.assetDef.id;
        assetGroupsStore.activateGroup(undefined);
    } else if (isAssetBrowserGroupEntry(entry)) {
        assetGroupsStore.activateGroup(entry.group.id);
        listStore.activeId = undefined;
    }
}

const items = computed(() => {
    const options: ContextMenuItem[][] = [];

    {
        const group = assetGroupsStore.activeGroup;
        if (group) {
            options.push([
                {
                    label: "Convert",
                    onSelect() {
                        for (const id of group.def.assets) {
                            conversionStore.enqueue(id);
                        }
                    },
                    icon: AppDesign.Icons.ActionConvertAsset,
                    color: "success",
                },
                {
                    label: "Copy Name",
                    icon: "empty",
                    onSelect() {
                        ClipboardHelper.writeTextAndToast(group.def.displayName!);
                    },
                    disabled: group.def.displayName == undefined,
                },
            ]);
        }
    }

    {
        const assets = listStore.selectedAssets;
        if (assets.length > 0) {
            const isAnyGrouped = assets.some((selected) => assetGroupsStore.isGrouped(selected.def.id));
            const isAllGrouped = assets.every((selected) => assetGroupsStore.isGrouped(selected.def.id));
            options.push([
                {
                    label: "Convert",
                    onSelect() {
                        for (const sel of assets) {
                            conversionStore.enqueue(sel.def.id);
                        }
                    },
                    icon: AppDesign.Icons.ActionConvertAsset,
                    color: "success",
                },
                {
                    label: "Create Asset Group",
                    onSelect() {
                        assetGroupsStore.createGroup(assets.map((s) => s.def.id));
                        table.value?.deselect();
                    },
                    icon: AppDesign.Icons.ActionCreateAssetGroup,
                    color: isAnyGrouped ? "neutral" : "success",
                    disabled: isAnyGrouped,
                },
            ]);

            if (assets.length === 1) {
                const sel = assets[0];

                if (sel.def.associatedFiles) {
                    const ass = sel.def.associatedFiles;
                    for (const assKey in ass) {
                        const key = assKey as keyof SharedAssetDefinitionAssociatedFiles;
                        const v = ass[key];
                        if (v) {
                            const entry = getAssociatedEntryName(key)!;
                            options.push([
                                {
                                    label: `Open ${entry.name}`,
                                    color: "info",
                                    onSelect() {
                                        openAssociatedFile(v);
                                    },
                                    icon: entry.icon,
                                },
                            ]);
                        }
                    }
                }

                options.push([
                    {
                        label: "Open .mca",
                        onSelect() {
                            openMca(sel);
                        },
                        icon: AppDesign.Icons.ActionOpenFileMca,
                    },
                    {
                        label: "Explore to .mca",
                        onSelect() {
                            exploreToMca(sel);
                        },
                        icon: AppDesign.Icons.ActionExploreToMca,
                    },
                    {
                        label: "Copy Name",
                        icon: "empty",
                        onSelect() {
                            ClipboardHelper.writeTextAndToast(sel.def.displayName!);
                        },
                        disabled: sel.def.displayName == undefined,
                    },
                    {
                        label: "Copy ID",
                        icon: "empty",
                        onSelect() {
                            ClipboardHelper.writeTextAndToast(sel.def.id);
                        },
                        disabled: sel.def.displayName == undefined,
                    },
                    {
                        label: "Remove from group",
                        icon: AppDesign.Icons.ActionRemove,
                        onSelect() {
                            assetGroupsStore.writeRemoveAssetsFromTheirGroups(assets.map((a) => a.def.id));
                        },
                        disabled: !isAllGrouped,
                    },
                ]);
            }
        }
    }

    return options;
});

function handleDragStart(event: DragEvent, primaryEntry: AssetBrowserEntry, allEntries: AssetBrowserEntry[]): void {
    const payloads: string[] = [];

    for (const entry of allEntries) {
        if (isAssetBrowserAssetEntry(entry)) {
            payloads.push(`asset;${entry.assetDef.id}`);
        } else {
            payloads.push(`group;${entry.group.id}`);
        }
    }

    const payload = payloads.join("\n");
    event.dataTransfer?.setData("text/plain", payload);
}

function handleEntryActivated(entry: AssetBrowserEntry): void {
    if (isAssetBrowserGroupEntry(entry)) {
        assetGroupsStore.toggleCollapsed(entry.group.id);
    }
}

function handleKeyDown(event: KeyboardEvent, entry: AssetBrowserEntry | undefined): void {
    // Copy
    if (event.ctrlKey && event.key === "c") {
        let name: string | undefined = undefined;

        if (isAssetBrowserAssetEntry(entry)) {
            name = entry.assetDef.displayName;
        }
        if (isAssetBrowserGroupEntry(entry)) {
            name = entry.group.def.displayName;
        }

        if (name) {
            ClipboardHelper.writeTextAndToast(name);
        }

        event.preventDefault();
    }

    if (event.key === "F2") {
        if (isAssetBrowserAssetEntry(entry)) {
            editingAsset.value = entry.assetDef.id;
        }
        if (isAssetBrowserGroupEntry(entry)) {
            editingGroup.value = entry.group.id;
        }
    }
}
</script>

<style scoped></style>
