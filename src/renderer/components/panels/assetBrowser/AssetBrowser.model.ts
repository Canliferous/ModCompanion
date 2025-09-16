import { SharedAssetDefinition, SharedAssetId } from "Shared/SharedAssetDefinition.js";
import { SharedAssetGroupDefinition } from "Shared/SharedAssetGroup.js";

export const AssetBrowserEntryTypes = {
    Unknown: 0,
    Asset: 1,
    Group: 2,
} as const;
export type AssetBrowserEntryType = (typeof AssetBrowserEntryTypes)[keyof typeof AssetBrowserEntryTypes];

interface AssetBrowserBaseEntry {
    type: AssetBrowserEntryType;
}

export interface AssetBrowserAssetEntry extends AssetBrowserBaseEntry {
    type: typeof AssetBrowserEntryTypes.Asset;
    assetDef: SharedAssetDefinition;
}

export interface AssetBrowserGroupEntry extends AssetBrowserBaseEntry {
    type: typeof AssetBrowserEntryTypes.Group;
    group: SharedAssetGroupDefinition;
}

export type AssetBrowserEntry = AssetBrowserAssetEntry | AssetBrowserGroupEntry;

export function isAssetBrowserAssetEntry(entry: AssetBrowserEntry | undefined | null): entry is AssetBrowserAssetEntry {
    return entry?.type === AssetBrowserEntryTypes.Asset;
}
export function isAssetBrowserGroupEntry(entry: AssetBrowserEntry | undefined | null): entry is AssetBrowserGroupEntry {
    return entry?.type === AssetBrowserEntryTypes.Group;
}

export function getAssetBrowserEntrySortString(entry: AssetBrowserEntry): string {
    if (isAssetBrowserGroupEntry(entry)) {
        return entry.group.displayName;
    }

    if (isAssetBrowserAssetEntry(entry)) {
        return entry.assetDef.displayName ?? entry.assetDef.id;
    }

    return "";
}
