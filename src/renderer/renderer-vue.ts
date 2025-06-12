import { createPinia } from "pinia";
import { createApp } from "vue";
import App from "./components/App.vue";
import ui from "@nuxt/ui/vue-plugin";
import { createMemoryHistory, createRouter, Router } from "vue-router";
import HomePage from "./components/pages/HomePage.vue";
import AssetsPage from "./components/pages/assets/AssetsPage.vue";
import MapsPage from "./components/pages/maps/MapsPage.vue";

export function initVue() {
    const pinia = createPinia();
    const app = createApp(App);

    const router = _initRouter();

    app.use(pinia);
    app.use(ui);
    app.use(router);

    app.mount("#app");

    const lastRoute = localStorage.getItem("last-route");
    if (lastRoute) {
        router.push(lastRoute);
    }
}

function _initRouter(): Router {
    const router = createRouter({
        routes: [
            { path: "/", component: HomePage },
            { path: "/assets", component: AssetsPage },
            { path: "/maps", component: MapsPage },
        ],
        history: createMemoryHistory(),
    });

    router.afterEach((to, from, failure) => {
        localStorage.setItem("last-route", to.fullPath);
    });

    return router;
}
