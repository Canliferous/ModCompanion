import { PanelBehavior, PanelModel } from "~/helper/GlobalComponents.js";
import { AppDesign } from "~/design/AppDesign.js";

export interface ConversionsModel extends PanelModel {}

export const ConversionsBehavior: PanelBehavior<ConversionsModel> = {
    getIcon(model: ConversionsModel | undefined): string {
        return AppDesign.Icons.Panel_Conversions;
    },
    getTitle(model: ConversionsModel | undefined): string {
        return "Conversions";
    },
};
