import "../main.css";
import "@fontsource/inter";
import "@fontsource-variable/jetbrains-mono";
import { initVue } from "~/renderer-vue.js";
import { initConfig } from "~/renderer-config.js";
import { useAssetGroupsStore } from "~/store/AssetGroupsStore.js";
import { initIcons } from "~/renderer-icons.js";
import { Logger } from "~/logger.js";
import { useTcArtifactsStore } from "~/store/TcArtifactsStore.js";
import { useFileBrowserStore } from "~/store/FileBrowserStore.js";
import * as Shared from "mod_companion_shared";

Logger.init();
initConfig();
initVue();
initIcons();

function postInit() {
    useAssetGroupsStore().refresh();
    useTcArtifactsStore().refresh();
    useFileBrowserStore().refresh();
}

postInit();

Logger.info(Shared.Log.Channel.Generic, "Renderer is ready");
window.electronAPI.app.rendererReady();
