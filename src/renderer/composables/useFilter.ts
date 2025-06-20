import { computed, ComputedRef, Ref } from "vue";
import { SharedAsset } from "Shared/SharedAsset.js";

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

                if (!asset.displayName.toLowerCase().includes(split)) {
                    match = false;
                }
            }

            if (match) {
                filteredAssets.push(asset);
            }
        }

        return filteredAssets;
    });
}
