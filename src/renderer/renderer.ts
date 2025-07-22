import "./main.css";
import "@fontsource/inter";
import "@fontsource-variable/jetbrains-mono";
import { initVue } from "~/renderer-vue.js";
import { initConfig } from "~/renderer-config.js";
import { useAssetListStore } from "~/store/AssetListStore.js";

initConfig();
initVue();

function postInit() {
    useAssetListStore().forceRefresh();
}

postInit();
