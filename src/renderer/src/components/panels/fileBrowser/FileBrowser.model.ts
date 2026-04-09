import { PanelBehavior, PanelModel } from "~/helper/GlobalComponents.js";
import { AppDesign } from "~/design/AppDesign.js";

export interface FileBrowserModel extends PanelModel {}

export const FileBrowserBehavior: PanelBehavior<FileBrowserModel> = {
    getIcon(model: FileBrowserModel | undefined): string {
        return AppDesign.Icons.Panel_FileBrowser;
    },
    getTitle(model: FileBrowserModel | undefined): string {
        return "File Browser";
    },
};
