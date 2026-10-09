import { PanelBehavior, PanelModel } from "~/helper/GlobalComponents.js";
import { AppDesign } from "~/design/AppDesign.js";

export interface GameConsoleModel extends PanelModel {}

export const GameConsoleBehavior: PanelBehavior<GameConsoleModel> = {
    getIcon(model: GameConsoleModel | undefined): string {
        return AppDesign.Icons.Panel_GameConsole;
    },
    getTitle(model: GameConsoleModel | undefined): string {
        return "Game Console";
    },
};
