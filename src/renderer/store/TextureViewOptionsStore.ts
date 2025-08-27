import { defineStore } from "pinia";
import { useRememberRef } from "~/composables/useRemember.js";
import { ref } from "vue";

export const useTextureViewOptionsStore = defineStore("texture-view-options", () => {
    const showChannels = useRememberRef(ref(true), "texture-show-channels");

    return { showChannels };
});
