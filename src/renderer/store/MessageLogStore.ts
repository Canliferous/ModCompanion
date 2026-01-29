import { defineStore } from "pinia";
import { SharedLogEvent } from "Shared/SharedLogger.js";

export const useMessageLogStore = defineStore("logs", () => {
    const logEvents = reactive<SharedLogEvent[]>([]);

    const latestEvent = computed(() => (logEvents.length > 0 ? logEvents[logEvents.length - 1] : undefined));

    function add(logEvent: SharedLogEvent): void {
        logEvents.push(logEvent);
    }

    return { logEvents, latestEvent, add };
});
