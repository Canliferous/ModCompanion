import { PanelBehavior, PanelModel } from "~/helper/GlobalComponents.js";
import { AppDesign } from "~/design/AppDesign.js";
import pathe from "pathe";

export interface FileInspectorModel extends PanelModel {
    file: string;
}

export const FileInspectorBehavior: PanelBehavior<FileInspectorModel> = {
    getIcon(model: FileInspectorModel | undefined): string {
        return AppDesign.Icons.Panel_FileInspector;
    },
    getTitle(model: FileInspectorModel | undefined): string {
        if (model) {
            return pathe.basename(model.file);
        } else {
            return "File";
        }
    },
};
