import { defineStore } from "pinia";
import { DockviewApi, DockviewReadyEvent, IDockviewPanel } from "dockview-vue";
import { AddPanelOptions } from "dockview-core/dist/cjs/dockview/options.js";
import { useAssetListStore } from "~/store/AssetListStore.js";
import { ComponentDesc, PanelComponents, PanelTitles } from "~/helper/PanelComponents.js";

export const usePanelsStore = defineStore("panels", () => {
    const api = ref<DockviewApi>();
    const currentPanels = ref<IDockviewPanel[]>([]);

    function handleReady(event: DockviewReadyEvent) {
        api.value = event.api;

        deserialize();

        event.api.onDidLayoutChange((e) => {
            serialize();
        });

        const updatePanels = () => {
            if (api.value) {
                currentPanels.value = api.value?.panels;
            }
        };

        event.api.onDidRemovePanel(updatePanels);
        event.api.onDidAddPanel(updatePanels);
    }

    function trySpawnPanel(panel: ComponentDesc, options?: Partial<AddPanelOptions>): IDockviewPanel | undefined {
        const openPanel = findOpenPanel(panel.componentId);
        if (openPanel) {
            return openPanel;
        }

        const op: AddPanelOptions = {
            ...options,
            id: panel.componentId,
            component: panel.componentId,
            title: PanelTitles[panel.componentId] ?? "",
        };

        return api.value?.addPanel(op);
    }

    function togglePanel(panel: ComponentDesc): void {
        const p = findOpenPanel(panel.componentId);
        if (p) {
            api.value?.removePanel(p);
        } else {
            trySpawnPanel(panel);
        }
    }

    function findOpenPanel(panelId: string): IDockviewPanel | undefined {
        return api.value?.panels.find((p) => p.id.startsWith(panelId));
    }

    function focusOrCreatePanel(panel: ComponentDesc): void {
        const p = trySpawnPanel(panel);
        p?.focus();
    }

    const SERIALIZE_KEY = "panel-layout";

    function deserialize(): void {
        const loadedLayout = localStorage.getItem(SERIALIZE_KEY);
        if (!(loadedLayout && api.value)) {
            return;
        }

        try {
            const layout = JSON.parse(loadedLayout);
            api.value.fromJSON(layout);
        } catch (err) {
            console.warn("Failed to load layout");
        }
    }

    function serialize(): void {
        if (api.value) {
            const serialized = api.value.toJSON();
            localStorage.setItem(SERIALIZE_KEY, JSON.stringify(serialized));
        }
    }

    return { api, handleReady, trySpawnPanel, togglePanel, findOpenPanel, focusOrCreatePanel };
});
