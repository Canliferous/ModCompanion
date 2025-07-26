import { computed, ComputedRef, Ref } from "vue";
import { SharedAsset } from "Shared/SharedAssetDefinition.js";

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

export function useAssetsFilter(assets: ComputedRef<SharedAsset[]>, filter: Ref<string>) {
    return computed(() => {
        if (filter.value === "") {
            return assets.value;
        }

        const filteredAssets: SharedAsset[] = [];
        for (const asset of assets.value) {
            const splits = filter.value.split(" ");

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
