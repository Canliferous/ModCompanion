import { App as VueApp, Component, DefineComponent } from "@vue/runtime-core";
import TestPanel from "~/components/panels/TestPanel.vue";
import HomePanel from "~/components/panels/HomePanel.vue";
import MapsPage from "~/components/pages/maps/MapsPage.vue";
import LoosePage from "~/components/pages/loose/LoosePage.vue";
import AssetsPage from "~/components/pages/assets/AssetsPage.vue";

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
        panelId: "_MapsPage",
        component: MapsPage,
        title: "Maps",
    },
    {
        panelId: "_AssetsPage",
        component: AssetsPage,
        title: "Assets",
    },
    {
        panelId: "_FileBrowser",
        component: LoosePage,
        title: "Files",
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
