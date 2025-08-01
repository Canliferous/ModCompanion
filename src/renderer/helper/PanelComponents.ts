import HomePanel from "~/components/panels/HomePanel.vue";
import MapsPanel from "~/components/panels/maps/MapsPanel.vue";
import FileBrowserPanel from "~/components/panels/fileBrowser/FileBrowserPanel.vue";
import AssetBrowserPanel from "~/components/panels/assetBrowser/AssetBrowserPanel.vue";
import AssetInspectorPanel from "~/components/panels/assetInspector/AssetInspectorPanel.vue";
import AssetInspectorTexturePreviewPanel from "~/components/panels/assetInspector/texturePreviewPanel/AssetInspectorTexturePreviewPanel.vue";
import AssetInspectorTextureChannelsPanel from "~/components/panels/assetInspector/textureChannelsPanel/AssetInspectorTextureChannelsPanel.vue";
import AssetInspectorTextureMetadataPanel from "~/components/panels/assetInspector/textureMetadataPanel/AssetInspectorTextureMetadataPanel.vue";
import AssetInspectorTextureConvertPanel from "~/components/panels/assetInspector/textureConvert/AssetInspectorTextureConvertPanel.vue";
import AssetInspectorGeneralPanel from "~/components/panels/assetInspector/generalPanel/AssetInspectorGeneralPanel.vue";
import SubPanelTab from "~/components/panelTabs/SubPanelTab.vue";

export interface ComponentDesc {
    componentId: PanelComponentId;
    component: any; // TODO: what the fuck is this type?????????
}

export const PanelComponentIds = {
    AssetInspectorTexturePreview: "_AssetInspector_TexturePreview",
    AssetInspectorTextureChannels: "_AssetInspector_TextureChannels",
    AssetInspectorTextureMetadata: "_AssetInspector_TextureMetadata",
    AssetInspectorTextureConvert: "_AssetInspector_TextureConvert",
    AssetInspectorGeneral: "_AssetInspector_General",
    Maps: "_Maps",
    Home: "_Home",
    FileBrowser: "_FileBrowser",
    AssetBrowser: "_AssetBrowser",
    AssetInspector: "_AssetInspector",
    SubPanelTab: "_SubPanelTab",
} as const;
export type PanelComponentId = (typeof PanelComponentIds)[keyof typeof PanelComponentIds];

export const PanelComponents = {
    additional: {
        assetInspectorTexturePreview: {
            componentId: "_AssetInspector_TexturePreview",
            component: AssetInspectorTexturePreviewPanel,
        },
        assetInspectorTextureChannels: {
            componentId: "_AssetInspector_TextureChannels",
            component: AssetInspectorTextureChannelsPanel,
        },
        assetInspectorTextureMetadata: {
            componentId: "_AssetInspector_TextureMetadata",
            component: AssetInspectorTextureMetadataPanel,
        },
        assetInspectorTextureConvert: {
            componentId: "_AssetInspector_TextureConvert",
            component: AssetInspectorTextureConvertPanel,
        },
        assetInspectorGeneral: {
            componentId: "_AssetInspector_General",
            component: AssetInspectorGeneralPanel,
        },
    } as const,
    panels: {
        home: {
            componentId: "_Home",
            component: HomePanel,
        },
        maps: {
            componentId: "_Maps",
            component: MapsPanel,
        },
        fileBrowser: {
            componentId: "_FileBrowser",
            component: FileBrowserPanel,
        },
        assetBrowser: {
            componentId: "_AssetBrowser",
            component: AssetBrowserPanel,
        },
        assetInspector: {
            componentId: "_AssetInspector",
            component: AssetInspectorPanel,
        },
    } as const,
    tabComponents: {
        subPanelTabs: {
            componentId: "_SubPanelTab",
            component: SubPanelTab,
        },
    } as const,
} as const;

let panelsArray: ComponentDesc[] | undefined;
export function getPanelComponentsArray(): ComponentDesc[] {
    if (!panelsArray) {
        panelsArray = [];
        for (const reg of Object.values(PanelComponents)) {
            const r = Object.values(reg) as any as ComponentDesc; // TODO: Wtf is this type???
            panelsArray.push(r);
        }
    }

    return panelsArray;
}

export const PanelTitles: Partial<Record<PanelComponentId, string>> = {
    _Maps: "Maps",
    _AssetBrowser: "Asset Browser",
    _FileBrowser: "File Browser",
    _AssetInspector: "Asset Inspector",
    _AssetInspector_TexturePreview: "Preview",
    _AssetInspector_TextureMetadata: "Meta",
    _AssetInspector_TextureConvert: "VTF Options",
    _AssetInspector_TextureChannels: "Channels",
    _AssetInspector_General: "General",
} as const;
