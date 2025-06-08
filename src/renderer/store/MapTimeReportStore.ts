import { defineStore } from "pinia";
import { useMapListStore } from "./MapListStore.js";
import { ref } from "vue";
import { SharedMapTimeReport } from "../../shared/SharedMapTimeReport.js";

export const useMapTimeReportStore = defineStore("map-time-report", () => {
    const report = ref<SharedMapTimeReport | undefined>();
    const showReport = ref(false);

    function createTimeReport(): void {
        const listStore = useMapListStore();

        // TODO: Why can this array not be structuredClone'd?????
        const mapPaths = [];
        for (const mapPath of listStore.mapPaths) {
            mapPaths.push(mapPath);
        }

        window.electronAPI.map.createTimeReport(mapPaths).then((r) => {
            report.value = r;
            console.log(r);
        });
    }

    return { createTimeReport, showReport, report };
});
