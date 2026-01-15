import { Ref, watch } from "vue";
import { watchDeep } from "@vueuse/core";
import { useWorkspaceStore } from "~/store/WorkspaceStore.js";

export function useRememberRef<T>(ref: Ref<T>, keyName: string) {
    watch(ref, (r) => localStorage.setItem(keyName, JSON.stringify(r)));

    const val = localStorage.getItem(keyName);
    if (!val) return ref;

    ref.value = JSON.parse(val);
    return ref;
}

export function useRememberWorkspaceRef<T>(ref: Ref<T>, keyName: string) {
    const workspaceStore = useWorkspaceStore();

    watch(
        () => workspaceStore.activeWorkspace,
        (w) => {
            const val = localStorage.getItem(`${keyName}+${w}`);
            if (val !== null) {
                ref.value = JSON.parse(val);
            }
        },
    );
    watch(ref, () => {
        localStorage.setItem(`${keyName}+${workspaceStore.activeWorkspace}`, JSON.stringify(ref.value));
    });

    const val = localStorage.getItem(`${keyName}+${workspaceStore.activeWorkspace}`);
    if (val === null) return ref;

    ref.value = JSON.parse(val);
    return ref;
}

export function useRememberStringArray<T extends string>(ref: Ref<T[]>, keyName: string): Ref<T[], T[]> {
    watchDeep(ref, (r) => localStorage.setItem(keyName, JSON.stringify(r)));

    const arrStr = localStorage.getItem(keyName);
    if (!arrStr) return ref;

    const arrAny = JSON.parse(arrStr);

    if (!Array.isArray(arrAny)) {
        console.warn(`Loading ${keyName} from local storage failed: Value is not array`);
        return ref;
    }

    const somethingNotString = arrAny.some((m) => typeof m !== "string");
    if (somethingNotString) {
        console.warn(`Loading ${keyName} from local storage failed: Some array items are not string`);
        return ref;
    }

    ref.value = arrAny as T[];
    return ref;
}
