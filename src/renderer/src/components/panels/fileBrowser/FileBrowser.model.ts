import { PanelBehavior, PanelModel } from "~/helper/GlobalComponents.js";
import { AppDesign } from "~/design/AppDesign.js";
import { EventHandler } from "~/composables/useEvent.js";
import { PanelShortcuts } from "~/composables/usePanelShortcuts.js";

export interface FileBrowserModel extends PanelModel {
    currentDir?: string;
    searchTerm?: string;
}

export interface FileBrowserShortcuts extends PanelShortcuts {
    onFocusSearch: EventHandler<void>;
    onRefresh: EventHandler<void>;
    onBack: EventHandler<void>;
    onForward: EventHandler<void>;
    onDelete: EventHandler<void>;
}

export const FileBrowserBehavior = {
    getIcon(model: FileBrowserModel | undefined): string {
        return AppDesign.Icons.Panel_FileBrowser;
    },
    getTitle(model: FileBrowserModel | undefined): string {
        return "File Browser";
    },
    ShortcutsInjectKey: Symbol() as InjectionKey<ComputedRef<FileBrowserShortcuts>>,
} satisfies PanelBehavior<FileBrowserModel>;
