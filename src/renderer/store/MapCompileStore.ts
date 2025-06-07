import { defineStore } from "pinia";
import { ref } from "vue";
import { State, State as PlayPauseStopControlsState } from "../components/common/PlayPauseStopControls.model.js";

export const useMapCompileStore = defineStore("map-compile", () => {
    const state = ref<PlayPauseStopControlsState>(PlayPauseStopControlsState.Stopped);

    function compileNow(mapPath: string) {
        if (state.value !== State.Stopped) return;

        window.electronAPI.map.enqueue(mapPath);
    }

    return { state, compileNow };
});
