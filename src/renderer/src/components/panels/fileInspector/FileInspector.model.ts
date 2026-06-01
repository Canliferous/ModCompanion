import { PanelBehavior, PanelModel } from "~/helper/GlobalComponents.js";
import { AppDesign } from "~/design/AppDesign.js";
import pathe from "pathe";
import { Reactive } from "vue";
import { EventHandler } from "~/composables/useEvent.js";
import { FileBrowserShortcuts } from "~/components/panels/fileBrowser/FileBrowser.model.js";

export interface FileInspectorModel extends PanelModel {
    file: string;
}

export interface FileInspectorShortcuts {
    onSave: EventHandler<void>;
}

export const FileInspectorBehavior = {
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
    FileEditorInjectKey: Symbol() as InjectionKey<{
        saveEvent: EventHandler<void>;
    }>,
    ShortcutsInjectKey: Symbol() as InjectionKey<FileInspectorShortcuts>,
} satisfies PanelBehavior<FileInspectorModel>;
