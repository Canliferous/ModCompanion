import { defineStore } from "pinia";
import { DockviewApi, IDockviewPanel } from "dockview-vue";

export const usePanelsStore = defineStore("panels", () => {
    // const panels = ref<IDockviewPanel[]>([]);
    const api = ref<DockviewApi>();

    return { api };
});
