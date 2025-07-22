import { App as VueApp, Component, DefineComponent } from "@vue/runtime-core";
import TestPanel from "~/components/panels/TestPanel.vue";
import HomePanel from "~/components/panels/HomePanel.vue";
import FileBrowser from "~/components/panels/fileBrowser/FileBrowser.vue";
import MapsPanel from "~/components/panels/maps/MapsPanel.vue";

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
        component: FileBrowser,
        title: "File Browser",
    },
];

export function getPanelConfig(): PanelConfig[] {
    return panels;
}

export function initPanels(app: VueApp<Element>): void {
    for (let panel of panels) {
        app.component(panel.panelId, panel.component);
    }
}
