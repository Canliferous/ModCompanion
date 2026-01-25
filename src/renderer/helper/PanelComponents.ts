import MapsPanel from "~/components/panels/maps/MapsPanel.vue";
import FileBrowserPanel from "~/components/panels/fileBrowser/FileBrowserPanel.vue";
import FileInspectorPanel from "~/components/panels/fileInspector/FileInspectorPanel.vue";
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
import WaterMark from "~/components/panels/WaterMark.vue";
import { AppDesign } from "~/design/AppDesign.js";
import AddPanelAction from "~/components/panels/AddPanelAction.vue";
import ConversionDetailsPanel from "~/components/panels/conversionDetails/ConversionDetailsPanel.vue";
import AssetInspectorTextureHotspotEditorPanel from "~/components/panels/assetInspector/textureHotspotEditor/AssetInspectorTextureHotspotEditorPanel.vue";

export interface ComponentDesc {
    componentId: PanelComponentId;
    component: any; // TODO: what the fuck is this type?????????
}

export const PanelComponentIds = {
    AssetInspectorTexturePreview: "_AssetInspector_TexturePreview",
    AssetInspectorTextureChannels: "_AssetInspector_TextureChannels",
    AssetInspectorTextureMetadata: "_AssetInspector_TextureMetadata",
    AssetInspectorTextureConvert: "_AssetInspector_TextureConvert",
    AssetInspectorTextureHotspotEditor: "_AssetInspector_TextureHotspotEditor",
    AssetInspectorGeneral: "_AssetInspector_General",
    MapList: "_MapList",
    MapCompileLog: "_MapCompileLog",
    FileBrowser: "_FileBrowser",
    FileInspector: "_FileInspector",
    AssetBrowser: "_AssetBrowser",
    AssetInspector: "_AssetInspector",
    Conversions: "_Conversions",
    ConversionDetails: "_ConversionDetails",
    StrataConsole: "_StrataConsole",
    PanelTab: "_PanelTab",
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
        assetInspectorTextureHotspotEditor: {
            componentId: "_AssetInspector_TextureHotspotEditor",
            component: AssetInspectorTextureHotspotEditorPanel,
        },
        assetInspectorGeneral: {
            componentId: "_AssetInspector_General",
            component: AssetInspectorGeneralPanel,
        },
    } as const,

    // The order here determines the sort order in panel creation dialogs
    panels: {
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
        conversionDetails: {
            componentId: "_ConversionDetails",
            component: ConversionDetailsPanel,
        },
        fileBrowser: {
            componentId: "_FileBrowser",
            component: FileBrowserPanel,
        },
        fileInspector: {
            componentId: "_FileInspector",
            component: FileInspectorPanel,
        },
        mapList: {
            componentId: "_MapList",
            component: MapsPanel,
        },
        mapCompileLog: {
            componentId: "_MapCompileLog",
            component: MapCompileLogPanel,
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
            component: WaterMark,
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
    _FileInspector: "File Inspector",
    _AssetInspector: "Asset Inspector",
    _AssetInspector_TexturePreview: "Preview",
    _AssetInspector_TextureMetadata: "Meta",
    _AssetInspector_TextureConvert: "VTF Options",
    _AssetInspector_TextureChannels: "Channels",
    _AssetInspector_TextureHotspotEditor: "Hotspot Editor",
    _AssetInspector_General: "General",
    _Conversions: "Conversion Events",
    _ConversionDetails: "Conversion Event Details",
    _StrataConsole: "Strata Console",
} as const;

export const PanelIcons: Partial<Record<PanelComponentId, string>> = {
    _MapList: AppDesign.Icons.Panel_MapList,
    _MapCompileLog: AppDesign.Icons.Panel_MapCompileLog,
    _AssetBrowser: AppDesign.Icons.Panel_AssetBrowser,
    _FileBrowser: AppDesign.Icons.Panel_FileBrowser,
    _FileInspector: AppDesign.Icons.Panel_FileInspector,
    _AssetInspector: AppDesign.Icons.Panel_AssetInspector,
    _AssetInspector_TexturePreview: AppDesign.Icons.Panel_AssetInspector_TexturePreview,
    _AssetInspector_TextureMetadata: AppDesign.Icons.Panel_AssetInspector_TextureMetadata,
    _AssetInspector_TextureConvert: AppDesign.Icons.Panel_AssetInspector_TextureConvert,
    _AssetInspector_TextureChannels: AppDesign.Icons.Panel_AssetInspector_TextureChannels,
    _AssetInspector_TextureHotspotEditor: AppDesign.Icons.Panel_AssetInspector_TextureHotspotEditor,
    _AssetInspector_General: AppDesign.Icons.Panel_AssetInspector_General,
    _Conversions: AppDesign.Icons.Panel_Conversions,
    _ConversionDetails: AppDesign.Icons.Panel_ConversionDetails,
    _StrataConsole: AppDesign.Icons.Panel_StrataConsole,
} as const;
