import { computed, ComputedRef, Reactive, Ref } from "vue";
import * as Shared from "mod_companion_shared";

export function useFilter<T>(items: Ref<T[]>, accessorFunc: (item: T) => string, filter: Ref<string>) {
    return computed(() => {
        if (filter.value === "") {
            return items.value;
        }

        const filteredItems: T[] = [];
        for (const item of items.value) {
            const accessor = accessorFunc(item);
            const splits = filter.value.split(" ");

            let match = true;
            for (const split of splits) {
                if (split === "") continue;

                if (!accessor.toLowerCase().includes(split)) {
                    match = false;
                }
            }

            if (match) {
                filteredItems.push(item);
            }
        }

        return filteredItems;
    });
}

export function useAssetsFilter(
    assets: ComputedRef<Shared.Asset.SharedAsset[]>,
    searchFilter: Ref<string>,
    typeFilter: Ref<Shared.Asset.Type[]>,
) {
    return computed(() => {
        const typeFilterVal = typeFilter.value;
        if (searchFilter.value === "" && typeFilterVal.length === 0) {
            return assets.value;
        }

        const filteredAssets: Shared.Asset.SharedAsset[] = [];
        for (const asset of assets.value) {
            if (typeFilterVal.length > 0) {
                const isIncluded = typeFilter.value.includes(asset.def.type);
                if (!isIncluded) continue;
            }

            const splits = searchFilter.value.split(" ");

            let match = true;
            for (const split of splits) {
                if (split === "") continue;

                if (!asset.def.displayName?.toLowerCase()?.includes(split)) {
                    match = false;
                }
            }

            if (match) {
                filteredAssets.push(asset);
            }
        }

        filteredAssets.sort((a, b) => {
            if (a.def.displayName !== undefined && b.def.displayName !== undefined) {
                return a.def.displayName.localeCompare(b.def.displayName);
            }

            if (a.defFilePath !== undefined && b.defFilePath !== undefined) {
                return a.defFilePath.localeCompare(b.defFilePath);
            }

            return a.def.id.localeCompare(b.def.id);
        });

        return filteredAssets;
    });
}

export function useFileFilter(files: Reactive<Map<string, Shared.FileListing.FileEntry[]>>, searchFilter: Ref<string>) {
    return computed<Shared.FileListing.FileEntry[]>(() => {
        const result: Shared.FileListing.FileEntry[] = [];

        const MAX_RESULTS = 1000;
        let resultsCount = 0;

        const searchTerms = searchFilter.value.split(" ");
        const { millis } = Shared.Timing.timeMillis(() => {
            loop1: for (const entry of files.values()) {
                for (const e of entry) {
                    let match = true;
                    for (const term of searchTerms) {
                        if (!e.name.includes(term)) {
                            match = false;
                        }
                    }

                    if (match) {
                        if (resultsCount++ > MAX_RESULTS) break loop1;
                        result.push(e);
                    }
                }
            }
        });

        result.sort((a, b) => a.name.localeCompare(b.name));

        return result;
    });
}
