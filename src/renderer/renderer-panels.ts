import { App as VueApp } from "@vue/runtime-core";
import { getAdditionalPanelsArray, getPanelArray } from "~/store/PanelsStore.js";

export function initPanels(app: VueApp<Element>): void {
    for (let panel of getPanelArray()) {
        app.component(panel.componentId, panel.component);
    }

    for (let panel of getAdditionalPanelsArray()) {
        app.component(panel.componentId, panel.component);
    }
}
