import "./main.css";
import "@fontsource/inter";
import "@fontsource-variable/jetbrains-mono";

import { createApp } from "vue";
import App from "./components/App.vue";
import ui from "@nuxt/ui/vue-plugin";
import { createPinia } from "pinia";
import { createMemoryHistory, createRouter } from "vue-router";
import HomePage from "./components/pages/HomePage.vue";
import GameAssetsPage from "./components/pages/GameAssetsPage.vue";
import ContentAssetsPage from "./components/pages/ContentAssetsPage.vue";
import MapsPage from "./components/pages/MapsPage.vue";

const pinia = createPinia();
const app = createApp(App);

const router = createRouter({
    routes: [
        { path: "/", component: HomePage },
        { path: "/game-assets", component: GameAssetsPage },
        { path: "/content-assets", component: ContentAssetsPage },
        { path: "/maps", component: MapsPage },
    ],
    history: createMemoryHistory(),
});

router.afterEach((to, from, failure) => {
    localStorage.setItem("last-route", to.fullPath);
});

app.use(pinia);
app.use(ui);
app.use(router);

app.mount("#app");

const lastRoute = localStorage.getItem("last-route");
if (lastRoute) {
    router.push(lastRoute);
}
