import { defineStore } from "pinia";
import { useRemember } from "~/composables/useRemember.js";
import { ref } from "vue";

export const useTextureViewOptionsStore = defineStore("texture-view-options", () => {
    const showChannels = useRemember(ref(true), "texture-show-channels");

    return { showChannels };
});
