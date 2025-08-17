import { Ref, watch } from "vue";
import { watchDeep } from "@vueuse/core";

export function useRemember<T>(ref: Ref<T>, keyName: string) {
    watch(ref, (r) => localStorage.setItem(keyName, JSON.stringify(r)));

    const val = localStorage.getItem(keyName);
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
