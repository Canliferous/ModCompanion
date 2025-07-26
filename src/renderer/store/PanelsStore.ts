import { defineStore } from "pinia";
import { DockviewApi, DockviewReadyEvent, IDockviewPanel } from "dockview-vue";
import { Component, DefineComponent } from "@vue/runtime-core";
import TestPanel from "~/components/panels/TestPanel.vue";
import HomePanel from "~/components/panels/HomePanel.vue";
import MapsPanel from "~/components/panels/maps/MapsPanel.vue";
import FileBrowserPanel from "~/components/panels/fileBrowser/FileBrowserPanel.vue";
import AssetBrowserPanel from "~/components/panels/assetBrowser/AssetBrowserPanel.vue";
import AssetInspectorPanel from "~/components/panels/assetInspector/AssetInspectorPanel.vue";
import { AddPanelOptions } from "dockview-core/dist/cjs/dockview/options.js";
import { useAssetListStore } from "~/store/AssetListStore.js";
import AssetInspectorTexturePanel from "~/components/panels/assetInspector/texturePanel/AssetInspectorTexturePanel.vue";
import AssetInspectorGeneralPanel from "~/components/panels/assetInspector/generalPanel/AssetInspectorGeneralPanel.vue";

export interface Panel {
    componentId: string;
    component: Component | DefineComponent;
    title: string;
}

const additionalPanels = {
    assetInspectorTexture: {
        componentId: "_AssetInspector_Texture",
        component: AssetInspectorTexturePanel,
        title: "Texture",
    },
    assetInspectorGeneral: {
        componentId: "_AssetInspector_General",
        component: AssetInspectorGeneralPanel,
        title: "General",
    },
};

const panels = {
    test: {
        componentId: "_TestPanel",
        component: TestPanel,
        title: "Test Panel",
    },
    home: {
        componentId: "_HomePanel",
        component: HomePanel,
        title: "Home",
    },
    maps: {
        componentId: "_Maps",
        component: MapsPanel,
        title: "Maps",
    },
    fileBrowser: {
        componentId: "_FileBrowser",
        component: FileBrowserPanel,
        title: "File Browser",
    },
    assetBrowser: {
        componentId: "_AssetBrowser",
        component: AssetBrowserPanel,
        title: "Asset Browser",
    },
    assetInspector: {
        componentId: "_AssetInspector",
        component: AssetInspectorPanel,
        title: "Asset Inspector",
    },
} satisfies Record<string, Panel>;

let panelsArray: Panel[] | undefined;

export function getPanels() {
    return panels;
}

export function getPanelArray(): Panel[] {
    if (!panelsArray) {
        panelsArray = Object.values(panels).sort((a, b) => a.title.localeCompare(b.title));
    }

    return panelsArray;
}

export function getAdditionalPanels() {
    return additionalPanels;
}

export function getAdditionalPanelsArray(): Panel[] {
    return Object.values(additionalPanels);
}

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

    function trySpawnPanel(panel: Panel, options?: Partial<AddPanelOptions>) {
        const openPanel = findOpenPanel(panel.componentId);
        if (openPanel) {
            return;
        }

        const op: AddPanelOptions = {
            ...options,
            id: panel.componentId,
            component: panel.componentId,
            title: panel.title,
        };

        return api.value?.addPanel(op);
    }

    function togglePanel(panel: Panel): void {
        const p = findOpenPanel(panel.componentId);
        if (p) {
            api.value?.removePanel(p);
        } else {
            trySpawnPanel(panel);
        }
    }

    function findOpenPanel(panelId: string) {
        return api.value?.panels.find((p) => p.id.startsWith(panelId));
    }

    watch(
        () => useAssetListStore().activeAsset,
        (asset) => {
            if (!asset) return;

            const browser = findOpenPanel(panels.assetBrowser.componentId);
            if (!browser) {
                console.warn("Trying to inspect asset but browser panel cannot be found");
                return;
            }
            const inspector = findOpenPanel(panels.assetInspector.componentId);

            if (inspector === undefined) {
                trySpawnPanel(panels.assetInspector, {
                    position: { referencePanel: browser.id, direction: "right" },
                });
            }
        },
    );

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

    return { api, handleReady, trySpawnPanel, togglePanel };
});
