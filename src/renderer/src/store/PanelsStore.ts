import { defineStore } from "pinia";
import { DockviewApi, DockviewReadyEvent, IDockviewPanel } from "dockview-vue";
import { AddPanelOptions } from "dockview-core/dist/cjs/dockview/options.js";
import { ComponentDesc, PanelComponents, PanelIcons, PanelTitles } from "~/helper/PanelComponents.js";
import { useWorkspaceStore } from "~/store/WorkspaceStore.js";
import { Logger } from "~/logger.js";
import * as Shared from "mod_companion_shared";

export const usePanelsStore = defineStore("panels", () => {
    const api = ref<DockviewApi>();
    const currentPanels = ref<IDockviewPanel[]>([]);
    const workspaceStore = useWorkspaceStore();

    watch(() => workspaceStore.activeWorkspace, deserialize);

    function handleReady(event: DockviewReadyEvent) {
        api.value = event.api;

        deserialize();

        event.api.onDidLayoutChange(() => {
            serialize();
        });

        const updatePanels = () => {
            if (api.value) {
                currentPanels.value = api.value?.panels;
            }
        };

        event.api.onDidRemovePanel(updatePanels);
        event.api.onDidAddPanel(updatePanels);
    }

    function trySpawnPanel(panel: ComponentDesc, options?: Partial<AddPanelOptions>): IDockviewPanel | undefined {
        const openPanel = findOpenPanel(panel.componentId);
        if (openPanel) {
            return openPanel;
        }

        const op: AddPanelOptions = {
            ...options,
            id: panel.componentId,
            component: panel.componentId,
            title: PanelTitles[panel.componentId] ?? "",
            tabComponent: PanelComponents.tabComponents.panelTab.componentId,
            params: { icon: PanelIcons[panel.componentId] },
        };

        return api.value?.addPanel(op);
    }

    function togglePanel(panel: ComponentDesc): void {
        const p = findOpenPanel(panel.componentId);
        if (p) {
            api.value?.removePanel(p);
        } else {
            trySpawnPanel(panel);
        }
    }

    function findOpenPanel(panelId: string): IDockviewPanel | undefined {
        return api.value?.panels.find((p) => p.id.startsWith(panelId));
    }

    function focusOrCreatePanel(panel: ComponentDesc, options?: Partial<AddPanelOptions>): void {
        const p = trySpawnPanel(panel, options);
        p?.focus();
    }

    function deserialize(): void {
        const activeWorkspace = workspaceStore.activeWorkspace;
        if (!activeWorkspace || !api.value) {
            return;
        }

        try {
            const panels = workspaceStore.workspacePanels[activeWorkspace];
            if (panels) {
                api.value.fromJSON(panels);
            } else {
                api.value.clear();
            }
        } catch (err) {
            console.warn("Failed to load layout", err);
        }
    }

    function serialize(): void {
        if (!api.value) {
            Logger.warning(Shared.Log.Channel.Generic, "Failed to serialize panels. Dockview api reference is null");
            return;
        }

        let activeWorkspace = workspaceStore.activeWorkspace;
        if (!activeWorkspace) {
            activeWorkspace = workspaceStore.createWorkspace();
        }

        const serializedDockview = api.value.toJSON();
        workspaceStore.updatePanels(activeWorkspace, serializedDockview);
    }

    return { api, handleReady, trySpawnPanel, togglePanel, findOpenPanel, focusOrCreatePanel };
});
