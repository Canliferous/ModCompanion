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
    const conversionsLastChangeTime = ref<number>(0);
    const events = ref<SharedConversionEvent[]>([]);
    const eventsLastChangeTime = ref<number>(0);
    const activeEvent = ref<SharedConversionEvent | undefined>();
    const summary = ref<SharedConversionSummary>({ currentStatus: "idle", totalSum: 0 });

    window.electronAPI.conversion.subscribeUpdated((event) => {
        const time1 = event.conversionsLastChangeTime?.getTime();
        if (time1 !== undefined && conversionsLastChangeTime.value !== time1) {
            conversions.value = event.conversions;
            conversionsLastChangeTime.value = time1;
        }

        const time2 = event.eventsLastChangeTime?.getTime();
        if (time2 !== undefined && eventsLastChangeTime.value !== time2) {
            events.value = event.events;
            eventsLastChangeTime.value = time2;
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

    return { conversions, conversionEvents: events, activeEvent, summary, getState, enqueue, enqueueAll, setActive };
});
