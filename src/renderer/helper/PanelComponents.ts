import MapsPanel from "~/components/panels/maps/MapsPanel.vue";
import FileBrowserPanel from "~/components/panels/fileBrowser/FileBrowserPanel.vue";
import AssetBrowserPanel from "~/components/panels/assetBrowser/AssetBrowserPanel.vue";
import AssetInspectorPanel from "~/components/panels/assetInspector/AssetInspectorPanel.vue";
import AssetInspectorTexturePreviewPanel from "~/components/panels/assetInspector/texturePreviewPanel/AssetInspectorTexturePreviewPanel.vue";
import AssetInspectorTextureChannelsPanel from "~/components/panels/assetInspector/textureChannelsPanel/AssetInspectorTextureChannelsPanel.vue";
import AssetInspectorTextureMetadataPanel from "~/components/panels/assetInspector/textureMetadataPanel/AssetInspectorTextureMetadataPanel.vue";
import AssetInspectorTextureConvertPanel from "~/components/panels/assetInspector/textureConvert/AssetInspectorTextureConvertPanel.vue";
import AssetInspectorGeneralPanel from "~/components/panels/assetInspector/generalPanel/AssetInspectorGeneralPanel.vue";
import PanelTab from "~/components/panelTabs/PanelTab.vue";
import MapCompileLogPanel from "~/components/panels/mapCompileLog/MapCompileLogPanel.vue";
import ConversionsPanel from "~/components/panels/conversions/ConversionsPanel.vue";
import StrataConsolePanel from "~/components/panels/strataConsole/StrataConsolePanel.vue";
import Watermark from "~/components/panels/Watermark.vue";
import { AppDesign } from "~/design/AppDesign.js";
import AddPanelAction from "~/components/panels/AddPanelAction.vue";

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
    MapList: "_MapList",
    MapCompileLog: "_MapCompileLog",
    FileBrowser: "_FileBrowser",
    AssetBrowser: "_AssetBrowser",
    AssetInspector: "_AssetInspector",
    Conversions: "_Conversions",
    StrataConsole: "_StrataConsole",
    SubPanelTab: "_SubPanelTab",
    Watermark: "_Watermark",
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
        mapList: {
            componentId: "_MapList",
            component: MapsPanel,
        },
        mapCompileLog: {
            componentId: "_MapCompileLog",
            component: MapCompileLogPanel,
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
        conversions: {
            componentId: "_Conversions",
            component: ConversionsPanel,
        },
        strataConsole: {
            componentId: "_StrataConsole",
            component: StrataConsolePanel,
        },
    } as const,
    tabComponents: {
        panelTab: {
            componentId: "_PanelTab",
            component: PanelTab,
        },
    } as const,
    other: {
        watermark: {
            componentId: "_Watermark",
            component: Watermark,
        },
        addPanelAction: {
            componentId: "_AddPanelAction",
            component: AddPanelAction,
        },
    },
} as const;

let panelsArray: ComponentDesc[] | undefined;
export function getPanelComponentsArray(): ComponentDesc[] {
    if (!panelsArray) {
        panelsArray = [];

        for (const c of Object.values(PanelComponents)) {
            for (const reg of Object.values(c)) {
                panelsArray.push(reg);
            }
        }
    }

    return panelsArray;
}

export const PanelTitles: Partial<Record<PanelComponentId, string>> = {
    _MapList: "Maps",
    _MapCompileLog: "Map Compile Log",
    _AssetBrowser: "Asset Browser",
    _FileBrowser: "File Browser",
    _AssetInspector: "Asset Inspector",
    _AssetInspector_TexturePreview: "Preview",
    _AssetInspector_TextureMetadata: "Meta",
    _AssetInspector_TextureConvert: "VTF Options",
    _AssetInspector_TextureChannels: "Channels",
    _AssetInspector_General: "General",
    _Conversions: "Conversions",
    _StrataConsole: "Strata Console",
} as const;

export const PanelIcons: Partial<Record<PanelComponentId, string>> = {
    _MapList: "lucide:map",
    _MapCompileLog: "lucide:list",
    _AssetBrowser: AppDesign.Icons.Asset,
    _FileBrowser: "lucide:folder",
    _AssetInspector: "lucide:file",
    _AssetInspector_TexturePreview: "lucide:image",
    _AssetInspector_TextureMetadata: "lucide:list",
    _AssetInspector_TextureConvert: AppDesign.Icons.Conversion,
    _AssetInspector_TextureChannels: "lucide:grid-2x2",
    _AssetInspector_General: "lucide:list",
    _Conversions: AppDesign.Icons.Conversion,
    _StrataConsole: "lucide:terminal",
} as const;
