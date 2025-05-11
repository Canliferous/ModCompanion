import "./main.css";

import { createApp } from "vue";
import App from "./components/App.vue";
import ui from "@nuxt/ui/vue-plugin";
import { createRouter, createWebHistory } from "vue-router";

const app = createApp(App);

const router = createRouter({
  routes: [],
  history: createWebHistory(),
});

app.use(ui);
app.use(router);

app.mount("#app");
