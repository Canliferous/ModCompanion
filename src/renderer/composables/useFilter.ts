import { Ref, computed } from "vue";

export function useFilter<T>(items: Ref<T[]>, accessorFunc: (item: T) => string, filter: Ref<string>) {
    return computed(() => {
        const filteredItems: T[] = [];

        if (filter.value === "") {
            return items.value;
        }

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
