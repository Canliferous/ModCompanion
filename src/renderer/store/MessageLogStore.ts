import { defineStore } from "pinia";
import { MAX_MESSAGES, SharedLogEvent } from "Shared/SharedLogger.js";

export const useMessageLogStore = defineStore("logs", () => {
    const logEvents = reactive<SharedLogEvent[]>([]);

    const latestEvent = computed(() => (logEvents.length > 0 ? logEvents[logEvents.length - 1] : undefined));

    function add(logEvent: SharedLogEvent): void {
        logEvents.push(logEvent);
        const tooManyCount = logEvents.length - MAX_MESSAGES;
        if (tooManyCount > 0) {
            logEvents.splice(0, tooManyCount);
        }
    }

    function clear(): void {
        logEvents.splice(0, logEvents.length);
    }

    return { logEvents, latestEvent, add, clear };
});
