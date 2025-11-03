import { defineStore } from "pinia";
import { reactive, ref } from "vue";
import { SharedMapCompileState } from "Shared/SharedMapCompile.js";
import { SharedPlayPauseStopControlsState } from "Shared/SharedPlayPauseStopState.js";
import { useMapListStore } from "~/store/MapListStore.js";

export const useMapCompileStore = defineStore("map-compile", () => {
    const state = ref<SharedPlayPauseStopControlsState>(SharedPlayPauseStopControlsState.Stopped);
    const progress = reactive(new Map<string, SharedMapCompileState>());

    function compileNow(mapPath: string) {
        if (state.value !== SharedPlayPauseStopControlsState.Stopped) return;

        window.electronAPI.map.enqueue([mapPath]);
    }

    window.electronAPI.map.subscribeCompileProgress((event) => {
        const key = event.mapPath + event.step;
        progress.set(key, event.state);
    });

    watch(state, (s) => {
        if (s === SharedPlayPauseStopControlsState.Stopped) {
            window.electronAPI.map.cancelQueue();
        } else if (s === SharedPlayPauseStopControlsState.Playing) {
            const mapList = useMapListStore().mapList;
            window.electronAPI.map.enqueue(mapList);
        }
    });

    return { state, compileNow, progress };
});
