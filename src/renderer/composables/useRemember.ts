import { Ref, watch } from "vue";
import { watchDeep } from "@vueuse/core";

export function useRemember<T>(ref: Ref<T>, keyName: string) {
    const onBeforeMount = () => {
        const val = localStorage.getItem(keyName);
        if (val === null) return;

        ref.value = JSON.parse(val);
    };
    watch(ref, (r) => localStorage.setItem(keyName, JSON.stringify(r)));

    return { onBeforeMount, ref };
}

export function useRememberStringArray(ref: Ref<string[]>, keyName: string) {
    const onBeforeMount = () => {
        const arrStr = localStorage.getItem(keyName);
        if (!arrStr) return;

        const arrAny = JSON.parse(arrStr);

        if (!Array.isArray(arrAny)) {
            console.warn(`Loading ${keyName} from local storage failed: Value is not array`);
            return;
        }

        const somethingNotString = arrAny.some((m) => typeof m !== "string");
        if (somethingNotString) {
            console.warn(`Loading ${keyName} from local storage failed: Some array items are not string`);
            return;
        }

        ref.value = arrAny as string[];
    };

    watchDeep(ref, (r) => localStorage.setItem(keyName, JSON.stringify(r)));

    return { onBeforeMount, ref };
}
