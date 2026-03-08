import "../main.css";
import "@fontsource/inter";
import "@fontsource-variable/jetbrains-mono";
import {initVue} from "~/renderer-vue.js";
import {initConfig} from "~/renderer-config.js";
import {useAssetListStore} from "~/store/AssetListStore.js";
import {useAssetGroupsStore} from "~/store/AssetGroupsStore.js";
import {initIcons} from "~/renderer-icons.js";
import {Logger} from "~/logger.js";
import {useTcArtifactsStore} from "~/store/TcArtifactsStore.js";

Logger.init();
initConfig();
initVue();
initIcons();

function postInit() {
    useAssetListStore().refresh();
    useAssetGroupsStore().refresh();
    useTcArtifactsStore().refresh();
}

postInit();
