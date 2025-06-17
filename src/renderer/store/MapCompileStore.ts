import { defineStore } from "pinia";
import { reactive, ref } from "vue";
import { State, State as PlayPauseStopControlsState } from "~/components/common/PlayPauseStopControls.model.ts";
import { SharedMapCompileState } from "Shared/SharedMapCompile.ts";

export const useMapCompileStore = defineStore("map-compile", () => {
    const state = ref<PlayPauseStopControlsState>(PlayPauseStopControlsState.Stopped);
    const progress = reactive(new Map<string, SharedMapCompileState>());

    function compileNow(mapPath: string) {
        if (state.value !== State.Stopped) return;

        window.electronAPI.map.enqueue(mapPath);
    }

    window.electronAPI.map.subscribeCompileProgress((event) => {
        const key = event.mapPath + event.step;
        progress.set(key, event.state);
    });

    return { state, compileNow, progress };
});
