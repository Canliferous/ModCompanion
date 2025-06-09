import { defineStore } from "pinia";
import { useMapListStore } from "./MapListStore.js";
import { ref } from "vue";
import { SharedMapTimeReport } from "../../shared/SharedMapTimeReport.js";
import { SharedMapPath } from "../../shared/SharedMapPath.js";

export const useMapTimeReportStore = defineStore("map-time-report", () => {
    const report = ref<SharedMapTimeReport | undefined>();
    const showReport = ref(false);
    const reportChart = ref<Map<SharedMapPath, number> | undefined>();

    function createTimeReport(): void {
        const listStore = useMapListStore();

        // TODO: Why can this array not be structuredClone'd?????
        const mapPaths = [];
        for (const mapPath of listStore.mapPaths) {
            mapPaths.push(mapPath);
        }

        window.electronAPI.map.createTimeReport(mapPaths).then((r) => {
            report.value = r;
            reportChart.value = _createReportChart(r);
        });
    }

    return { createTimeReport, showReport, report, reportChart };
});

function _createReportChart(report: SharedMapTimeReport): Map<SharedMapPath, number> {
    const map = new Map<SharedMapPath, number>();

    let timeSum = 0;
    let longestTime = 0;
    let shortestTime = Number.MAX_VALUE;

    for (let secs of report.totals.values()) {
        timeSum += secs;

        if (secs > longestTime) {
            longestTime = secs;
        }

        if (secs < shortestTime) {
            shortestTime = secs;
        }
    }

    for (const [mapName, totalSeconds] of report.totals) {
        const ratio = totalSeconds / longestTime;

        map.set(mapName, Math.round(ratio * 100));
    }

    return map;
}
