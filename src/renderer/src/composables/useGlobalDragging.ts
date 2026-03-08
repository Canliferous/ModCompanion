import { useEventListener } from "@vueuse/core";

export function useGlobalDragging() {
    const isDragging = ref(false);
    let dragCounter = 0;

    useEventListener(window, "dragenter", () => {
        dragCounter++;
        isDragging.value = true;
    });

    useEventListener(window, "dragleave", () => {
        dragCounter--;
        if (dragCounter <= 0) {
            dragCounter = 0;
            isDragging.value = false;
        }
    });

    useEventListener(window, "drop", () => {
        dragCounter = 0;
        isDragging.value = false;
    });

    return { isDragging };
}
