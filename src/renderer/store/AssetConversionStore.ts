import { defineStore } from "pinia";
import {
    SharedConversion,
    SharedConversionHistoryItem,
    SharedConversionState,
    SharedConversionSummaryEvent,
} from "Shared/SharedConversion.js";
import { SharedAssetId } from "Shared/SharedAssetDefinition.js";

export const useAssetConversionStore = defineStore("asset-conversion", () => {
    const conversions = ref<Map<SharedAssetId, SharedConversion>>(new Map());
    const conversionHistory = ref<SharedConversionHistoryItem[]>([]);
    const activeHistory = ref<SharedConversionHistoryItem | undefined>();
    const summary = ref<SharedConversionSummaryEvent>({ currentStatus: "idle", totalSum: 0 });

    window.electronAPI.conversion.subscribeUpdated((event) => {
        conversions.value = event.conversions;
        conversionHistory.value = event.history;
    });

    window.electronAPI.conversion.subscribeSummary((event) => {
        summary.value = event;
    });

    function getState(id: SharedAssetId): SharedConversionState {
        return conversions.value.get(id)?.state ?? SharedConversionState.Unknown;
    }

    function enqueue(id: SharedAssetId): void {
        window.electronAPI.conversion.enqueue(id);
    }

    async function _fetchState() {
        const state = await window.electronAPI.conversion.getState();
        conversions.value = state.conversions;
    }

    _fetchState();
    window.electronAPI.conversion.startAgent();

    return { conversions, conversionHistory, activeHistory, summary, getState, enqueue };
});
