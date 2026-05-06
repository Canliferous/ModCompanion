import { PanelBehavior, PanelModel } from "~/helper/GlobalComponents.js";
import { AppDesign } from "~/design/AppDesign.js";

export interface MapCompileLogModel extends PanelModel {}

export const MapCompileLogBehavior: PanelBehavior<MapCompileLogModel> = {
    getIcon(model: MapCompileLogModel | undefined): string {
        return AppDesign.Icons.Panel_MapCompileLog;
    },
    getTitle(model: MapCompileLogModel | undefined): string {
        return "Map Compile Log";
    },
};
