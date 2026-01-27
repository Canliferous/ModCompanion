import { defineStore } from "pinia";
import {
    SharedConversion,
    SharedConversionEvent,
    SharedConversionState,
    SharedConversionSummary,
} from "Shared/SharedConversion.js";
import { SharedAssetId } from "Shared/SharedAssetDefinition.js";

export const useAssetConversionStore = defineStore("asset-conversion", () => {
    const conversions = ref<Map<SharedAssetId, SharedConversion>>(new Map());
    const conversionEvents = ref<SharedConversionEvent[]>([]);
    const activeEvent = ref<SharedConversionEvent | undefined>();
    const summary = ref<SharedConversionSummary>({ currentStatus: "idle", totalSum: 0 });

    window.electronAPI.conversion.subscribeUpdated((event) => {
        if (event.conversions.size !== conversions.value.size) {
            conversions.value = event.conversions;
        }
        if (event.events.length !== conversionEvents.value.length) {
            conversionEvents.value = event.events;
        }
        summary.value = event.summary;
    });

    function getState(id: SharedAssetId): SharedConversionState {
        return conversions.value.get(id)?.state ?? SharedConversionState.Unknown;
    }

    function enqueue(id: SharedAssetId): void {
        window.electronAPI.conversion.enqueue(id);
    }

    function enqueueAll(): void {
        window.electronAPI.conversion.enqueueAll();
    }

    async function _fetchState() {
        const state = await window.electronAPI.conversion.getState();
        conversions.value = state.conversions;
    }

    function setActive(event: SharedConversionEvent | undefined): void {
        activeEvent.value = event;
    }

    _fetchState();
    window.electronAPI.conversion.startAgent();

    return { conversions, conversionEvents, activeEvent, summary, getState, enqueue, enqueueAll, setActive };
});
