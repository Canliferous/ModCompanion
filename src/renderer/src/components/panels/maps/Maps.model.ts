import { PanelBehavior, PanelModel } from "~/helper/GlobalComponents.js";
import { AppDesign } from "~/design/AppDesign.js";

export interface MapsModel extends PanelModel {}

export const MapsBehavior: PanelBehavior<MapsModel> = {
    getIcon(model: MapsModel | undefined): string {
        return AppDesign.Icons.Panel_MapList;
    },
    getTitle(model: MapsModel | undefined): string {
        return "Maps";
    },
};
