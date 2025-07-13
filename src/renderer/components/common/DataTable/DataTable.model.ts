export interface DataTableColumn<T> {
    id: string;
    label?: string;
    size?: string;
    cell?: (entry: T) => VNode;
}

export const DataTableSelectionInjectKey = Symbol() as InjectionKey<{
    activeIdx: Ref<number | undefined>;
    selectedIdx: Ref<number[]>;
    selectStartIdx: Ref<number | undefined>;
    deselect: () => void;
    startSelect: (startIdx: number) => void;
    endSelect: (endIdx: number) => void;
    toggleSelect: (idx: number) => void;
}>;
