import { App as VueApp } from "vue";

import { getPanelComponentsArray } from "~/helper/PanelComponents.js";

export function initPanels(app: VueApp<Element>): void {
    for (const panel of getPanelComponentsArray()) {
        app.component(panel.componentId, panel.component);
    }
}
