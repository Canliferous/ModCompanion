import { App as VueApp } from "@vue/runtime-core";

import { getPanelComponentsArray } from "~/helper/PanelComponents.js";

export function initPanels(app: VueApp<Element>): void {
    for (let panel of getPanelComponentsArray()) {
        app.component(panel.componentId, panel.component);
    }
}
