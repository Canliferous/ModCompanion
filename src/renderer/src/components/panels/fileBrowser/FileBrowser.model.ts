import { PanelBehavior, PanelModel } from "~/helper/GlobalComponents.js";
import { AppDesign } from "~/design/AppDesign.js";
import * as Shared from "mod_companion_shared";
import { EventHandler } from "~/composables/useEvent.js";

export interface FileBrowserModel extends PanelModel {
    currentDir?: string;
    searchTerm?: string;
}

export interface FileBrowserShortcuts {
    onFocusSearch: EventHandler<void>;
    onRefresh: EventHandler<void>;
    onBack: EventHandler<void>;
    onForward: EventHandler<void>;
}

export const FileBrowserBehavior = {
    getIcon(model: FileBrowserModel | undefined): string {
        return AppDesign.Icons.Panel_FileBrowser;
    },
    getTitle(model: FileBrowserModel | undefined): string {
        return "File Browser";
    },
    ShortcutsInjectKey: Symbol() as InjectionKey<FileBrowserShortcuts>,
} satisfies PanelBehavior<FileBrowserModel>;
