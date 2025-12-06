import { createApp } from "vue";
import { createPinia } from "pinia";
import ui from "@nuxt/ui/vue-plugin";
import App from "~/components/App.vue";
import { initPanels } from "~/renderer-panels.js";
import { usePanelsManagerStore } from "~/store/PanelsManagerStore.js";
import { useMapConsoleStore } from "~/store/MapConsoleStore.js";
import { useAssetConversionStore } from "~/store/AssetConversionStore.js";
import { createMemoryHistory, createRouter } from "vue-router";
import { useStrataInteropStore } from "~/store/StrataInteropStore.js";
import { useTcArtifactsStore } from "~/store/TcArtifactsStore.js";

export function initVue() {
    const pinia = createPinia();
    const app = createApp(App);

    app.use(pinia);
    app.use(ui);

    // Create empty router because nuxt ui has a stupid dependency on it
    app.use(createRouter({ history: createMemoryHistory(), routes: [] }));

    initPanels(app);
    _initSystemStores();

    app.mount("#app");
}

// These stores need to be initialized on app startup
function _initSystemStores() {
    usePanelsManagerStore();
    useMapConsoleStore();
    useAssetConversionStore();
    useStrataInteropStore();
    useTcArtifactsStore();
}
