export interface DataTableColumn<T> {
    id: string;
    label?: string;
    size?: string;
    cell?: (entry: T, depth: number) => VNode | undefined;
    headerClass?: string;
}

export const DataTableSelectionInjectKey = Symbol() as InjectionKey<{
    activeIdx: Ref<number | undefined>;
    selectedIdx: Ref<number[]>;
    selectStartIdx: Ref<number | undefined>;
    deselect: () => void;
    selectAll: () => void;
    startSelect: (startIdx: number) => void;
    endSelect: (endIdx: number) => void;
    toggleSelect: (idx: number) => void;
    navigate: (up: boolean, shiftHeld: boolean) => void;
}>;

export const DataTableEntryActionInjectKey = Symbol() as InjectionKey<{
    onEntryActivated: (idx: number) => void;
    onEntryContextMenu: (event: MouseEvent, idx: number) => void;
}>;

export interface DataTableHierarchyEntry<T> {
    entry: T;
    depth: number;
    id: number;
}
