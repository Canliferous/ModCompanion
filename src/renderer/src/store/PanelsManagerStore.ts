import { defineStore } from "pinia";
import { useAssetListStore } from "~/store/AssetListStore.js";
import { usePanelsStore } from "~/store/PanelsStore.js";
import { PanelComponents } from "~/helper/GlobalComponents.js";
import { useFileBrowserStore } from "~/store/FileBrowserStore.js";
import { useMapListStore } from "~/store/MapListStore.js";
import { useAssetConversionStore } from "~/store/AssetConversionStore.js";

export const usePanelsManagerStore = defineStore("panels-manager", () => {
    const assetListStore = useAssetListStore();
    const mapListStore = useMapListStore();
    const panelsStore = usePanelsStore();
    const conversionStore = useAssetConversionStore();

    // // TODO Generalize this????
    // watch(
    //     () => assetListStore.activeAsset,
    //     (asset) => {
    //         if (!asset) return;
    //
    //         const browser = panelsStore.findOpenPanel(PanelComponents.panels.assetBrowser.componentId);
    //         if (!browser) {
    //             console.warn("Trying to inspect asset but browser panel cannot be found");
    //             return;
    //         }
    //         panelsStore.focusOrCreatePanel(PanelComponents.panels.assetInspector, {
    //             position: { referencePanel: browser.id, direction: "right" },
    //         });
    //     },
    // );
    //
    // watch(
    //     () => mapListStore.selectedMap,
    //     (asset) => {
    //         if (!asset) return;
    //
    //         const listPanel = panelsStore.findOpenPanel(PanelComponents.panels.mapList.componentId);
    //         if (!listPanel) {
    //             console.warn("Trying to open map compile log but map list panel cannot be found");
    //             return;
    //         }
    //         panelsStore.focusOrCreatePanel(PanelComponents.panels.mapCompileLog, {
    //             position: { referencePanel: listPanel.id, direction: "below" },
    //         });
    //     },
    // );
    //
    // watch(
    //     () => conversionStore.activeEvent,
    //     (activeHistory) => {
    //         if (!activeHistory) return;
    //
    //         const conversionsPanel = panelsStore.findOpenPanel(PanelComponents.panels.conversions.componentId);
    //         if (!conversionsPanel) {
    //             console.warn("Trying to open conversion details but the panel cannot be found");
    //             return;
    //         }
    //         panelsStore.focusOrCreatePanel(PanelComponents.panels.conversionDetails, {
    //             position: { referencePanel: conversionsPanel.id, direction: "right" },
    //         });
    //     },
    // );

    function openFileBrowser(path: string): void {
        // panelsStore.focusOrCreatePanel(PanelComponents.panels.fileBrowser);
        // useFileBrowserStore().setCurrentDir(path);
    }

    return { openFileBrowser };
});
