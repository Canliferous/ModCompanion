import { createApp } from "vue";
import { createPinia } from "pinia";
import ui from "@nuxt/ui/vue-plugin";
import App from "~/components/App.vue";
import { initPanels } from "~/renderer-panels.js";

export function initVue() {
    const pinia = createPinia();
    const app = createApp(App);

    app.use(pinia);
    app.use(ui);

    initPanels(app);

    app.mount("#app");
}
