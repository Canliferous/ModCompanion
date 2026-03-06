import { defineStore } from "pinia";
import { reactive, ref } from "vue";
import { CompileState } from "Shared/SharedMap.js";
import { SharedPlayPauseStopControlsState } from "Shared/SharedPlayPauseStopState.js";
import { useMapListStore } from "~/store/MapListStore.js";

export const useMapCompileStore = defineStore("map-compile", () => {
    const state = ref<SharedPlayPauseStopControlsState>(SharedPlayPauseStopControlsState.Stopped);
    const progress = reactive(new Map<string, CompileState>());

    function compileNow(mapPath: string) {
        if (state.value !== SharedPlayPauseStopControlsState.Stopped) return;

        window.electronAPI.map.enqueue([mapPath]);
    }

    window.electronAPI.map.subscribeCompileProgress((event) => {
        const key = event.mapPath + event.step;
        progress.set(key, event.state);
    });

    watch(state, (newState, oldState) => {
        if (newState === SharedPlayPauseStopControlsState.Stopped) {
            window.electronAPI.map.cancelQueue();
        } else if (newState === SharedPlayPauseStopControlsState.Playing) {
            if (oldState === SharedPlayPauseStopControlsState.Paused) {
                window.electronAPI.map.pauseQueue(false);
            } else {
                const mapList = useMapListStore().mapList;
                window.electronAPI.map.enqueue(toRaw(mapList));
                progress.clear();
            }
        } else if (newState === SharedPlayPauseStopControlsState.Paused) {
            window.electronAPI.map.pauseQueue(true);
        }
    });

    return { state, compileNow, progress };
});
