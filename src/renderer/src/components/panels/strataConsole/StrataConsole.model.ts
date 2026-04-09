import { PanelBehavior, PanelModel } from "~/helper/GlobalComponents.js";
import { AppDesign } from "~/design/AppDesign.js";

export interface StrataConsoleModel extends PanelModel {}

export const StrataConsoleBehavior: PanelBehavior<StrataConsoleModel> = {
    getIcon(model: StrataConsoleModel | undefined): string {
        return AppDesign.Icons.Panel_StrataConsole;
    },
    getTitle(model: StrataConsoleModel | undefined): string {
        return "Strata Console";
    },
};
