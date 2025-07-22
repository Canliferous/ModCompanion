import { App as VueApp, Component, DefineComponent } from "@vue/runtime-core";
import TestPanel from "~/components/panels/TestPanel.vue";
import HomePanel from "~/components/panels/HomePanel.vue";
import FileBrowser from "~/components/panels/fileBrowser/FileBrowser.vue";
import MapsPanel from "~/components/panels/maps/MapsPanel.vue";
import AssetBrowser from "~/components/panels/assetBrowser/AssetBrowser.vue";
import AssetBrowserPanel from "~/components/panels/assetBrowser/AssetBrowserPanel.vue";
import FileBrowserPanel from "~/components/panels/fileBrowser/FileBrowserPanel.vue";
import AssetInspectorPanel from "~/components/panels/assetInspector/AssetInspectorPanel.vue";
import AssetInspectorTexturePanel from "~/components/panels/assetInspector/texturePanel/AssetInspectorTexturePanel.vue";
import AssetInspectorFilesPanel from "~/components/panels/assetInspector/filesPanel/AssetInspectorFilesPanel.vue";

export interface PanelConfig {
    component: Component | DefineComponent;
    title: string;
    panelId: string;
}

const panels: PanelConfig[] = [
    {
        panelId: "_TestPanel",
        component: TestPanel,
        title: "Test Panel",
    },
    {
        panelId: "_HomePanel",
        component: HomePanel,
        title: "Home",
    },
    {
        panelId: "_Maps",
        component: MapsPanel,
        title: "Maps",
    },
    {
        panelId: "_FileBrowser",
        component: FileBrowserPanel,
        title: "File Browser",
    },
    {
        panelId: "_AssetBrowser",
        component: AssetBrowserPanel,
        title: "Asset Browser",
    },
    {
        panelId: "_AssetInspector",
        component: AssetInspectorPanel,
        title: "Asset Inspector",
    },
    {
        panelId: "_AssetInspectorTexture",
        component: AssetInspectorTexturePanel,
        title: "Asset Inspector: Texture",
    },
    {
        panelId: "_AssetInspectorFiles",
        component: AssetInspectorFilesPanel,
        title: "Asset Inspector: Files",
    },
].sort((a, b) => a.title.localeCompare(b.title));

export function getPanelConfig(): PanelConfig[] {
    return panels;
}

export function initPanels(app: VueApp<Element>): void {
    for (let panel of panels) {
        app.component(panel.panelId, panel.component);
    }
}
