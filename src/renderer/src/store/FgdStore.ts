import { defineStore } from "pinia";

export const useFgdStore = defineStore("fgd", () => {
    const building = ref(false);
    const result = ref<boolean | undefined>();

    function buildFgd() {
        building.value = true;
        window.electronAPI.fgd
            .build()
            .then((r) => {
                result.value = r;
            })
            .finally(() => {
                building.value = false;
            });
    }

    return { buildFgd, building, result };
});
