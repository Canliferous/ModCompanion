import { defineStore } from "pinia";
import { ref } from "vue";
import { State as PlayPauseStopControlsState } from "../components/common/PlayPauseStopControls.model.js";

export const useMapCompileStore = defineStore("map-compile", () => {
    const state = ref<PlayPauseStopControlsState>(PlayPauseStopControlsState.Stopped);

    return { state };
});
