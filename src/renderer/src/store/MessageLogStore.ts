import { defineStore } from "pinia";
import * as Shared from "mod_companion_shared";

export const useMessageLogStore = defineStore("logs", () => {
    const logEvents = reactive<Shared.Log.Event[]>([]);

    const latestEvent = computed(() => (logEvents.length > 0 ? logEvents[logEvents.length - 1] : undefined));

    function add(logEvent: Shared.Log.Event): void {
        logEvents.push(logEvent);
        const tooManyCount = logEvents.length - Shared.Log.MAX_MESSAGES;
        if (tooManyCount > 0) {
            logEvents.splice(0, tooManyCount);
        }
    }

    function clear(): void {
        logEvents.splice(0, logEvents.length);
    }

    return { logEvents, latestEvent, add, clear };
});
