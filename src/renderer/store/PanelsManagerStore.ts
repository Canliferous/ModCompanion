import { defineStore } from "pinia";
import { useAssetListStore } from "~/store/AssetListStore.js";
import { usePanelsStore } from "~/store/PanelsStore.js";
import { PanelComponents } from "~/helper/PanelComponents.js";
import { useFileBrowserStore } from "~/store/FileBrowserStore.js";
import { useMapListStore } from "~/store/MapListStore.js";

export const usePanelsManagerStore = defineStore("panels-manager", () => {
    const assetListStore = useAssetListStore();
    const mapListStore = useMapListStore();
    const panelsStore = usePanelsStore();

    watch(
        () => assetListStore.activeAsset,
        (asset) => {
            if (!asset) return;

            const browser = panelsStore.findOpenPanel(PanelComponents.panels.assetBrowser.componentId);
            if (!browser) {
                console.warn("Trying to inspect asset but browser panel cannot be found");
                return;
            }
            panelsStore.trySpawnPanel(PanelComponents.panels.assetInspector, {
                position: { referencePanel: browser.id, direction: "right" },
            });
        },
    );

    watch(
        () => mapListStore.selectedMap,
        (asset) => {
            if (!asset) return;

            const list = panelsStore.findOpenPanel(PanelComponents.panels.mapList.componentId);
            if (!list) {
                console.warn("Trying to open map compile log but map list panel cannot be found");
                return;
            }
            panelsStore.trySpawnPanel(PanelComponents.panels.mapCompileLog, {
                position: { referencePanel: list.id, direction: "below" },
            });
        },
    );

    function openFileBrowser(path: string): void {
        panelsStore.focusOrCreatePanel(PanelComponents.panels.fileBrowser);
        useFileBrowserStore().updateCurrentDir(path);
    }

    return { openFileBrowser };
});
