import { defineStore } from "pinia";
import { useAssetListStore } from "~/store/AssetListStore.js";
import { usePanelsStore } from "~/store/PanelsStore.js";
import { PanelComponents } from "~/helper/PanelComponents.js";
import { useFileBrowserStore } from "~/store/FileBrowserStore.js";

export const usePanelsManagerStore = defineStore("panels-manager", () => {
    const assetListStore = useAssetListStore();
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

    function openFileBrowser(path: string): void {
        panelsStore.focusOrCreatePanel(PanelComponents.panels.fileBrowser);
        useFileBrowserStore().updateCurrentDir(path);
    }

    return { openFileBrowser };
});
