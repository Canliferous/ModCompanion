export interface SharedVtfEnumGrouping<T> {
    groups: SharedVtfEnumGroup<T>[];
    ungrouped: T[];
}

export interface SharedVtfEnumGroup<T> {
    label: string;
    items: T[];
}

export function getUngrouped<T>(groups: SharedVtfEnumGroup<T>[], allItems: T[]): T[] {
    const ungrouped = Object.values(allItems);

    for (const group of groups) {
        for (const flag of group.items) {
            const idx = ungrouped.indexOf(flag);
            ungrouped.splice(idx, 1);
        }
    }

    return ungrouped;
}

export function createGrouping<T>(groups: SharedVtfEnumGroup<T>[], allItems: T[]): SharedVtfEnumGrouping<T> {
    return {
        groups,
        ungrouped: getUngrouped(groups, allItems),
    };
}
