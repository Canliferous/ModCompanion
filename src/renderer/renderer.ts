import "./main.css";
import "@fontsource/inter";
import "@fontsource-variable/jetbrains-mono";

import { createApp } from "vue";
import App from "./components/App.vue";
import ui from "@nuxt/ui/vue-plugin";
import { createPinia } from "pinia";
import { createMemoryHistory, createRouter, Router } from "vue-router";
import HomePage from "./components/pages/HomePage.vue";
import GameAssetsPage from "./components/pages/GameAssetsPage.vue";
import ContentAssetsPage from "./components/pages/ContentAssetsPage.vue";
import MapsPage from "./components/pages/maps/MapsPage.vue";
import { initVue } from "./renderer-vue.js";
import { initConfig } from "./renderer-config.js";

initConfig();
initVue();
