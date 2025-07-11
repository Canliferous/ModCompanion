import { createApp } from "vue";
import { createPinia } from "pinia";
import { createMemoryHistory, createRouter, Router } from "vue-router";
import { useAssetListStore } from "~/store/AssetListStore.js";
import ui from "@nuxt/ui/vue-plugin";
import App from "~/components/App.vue";
import HomePage from "~/components/pages/HomePage.vue";
import AssetsPage from "~/components/pages/assets/AssetsPage.vue";
import MapsPage from "~/components/pages/maps/MapsPage.vue";
import LoosePage from "~/components/pages/loose/LoosePage.vue";

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
            {
                path: "/assets",
                component: AssetsPage,
                beforeEnter: (to, from) => {
                    const assetListStore = useAssetListStore();
                    if (assetListStore.assets.size === 0) {
                        assetListStore.forceRefresh();
                    }
                },
            },
            { path: "/loose", component: LoosePage },
            { path: "/maps", component: MapsPage },
        ],
        history: createMemoryHistory(),
    });

    router.afterEach((to, from, failure) => {
        localStorage.setItem("last-route", to.fullPath);
    });

    return router;
}
