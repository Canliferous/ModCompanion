import { defineStore } from "pinia";
import { SharedLogEvent } from "Shared/SharedLogger.js";

export const useLogStore = defineStore("logs", () => {
    const logEvents = reactive<SharedLogEvent[]>([]);
    const drawerOpen = ref(false);

    const latestEvent = computed(() => (logEvents.length > 0 ? logEvents[logEvents.length - 1] : undefined));

    function add(logEvent: SharedLogEvent): void {
        logEvents.push(logEvent);
    }

    function toggleDrawer(): void {
        drawerOpen.value = !drawerOpen.value;
    }

    return { logEvents, latestEvent, drawerOpen, add, toggleDrawer };
});
