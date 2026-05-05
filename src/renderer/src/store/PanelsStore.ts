import { defineStore } from "pinia";
import { DockviewApi, DockviewReadyEvent, IDockviewPanel } from "dockview-vue";
import { AddPanelOptions } from "dockview-core/dist/cjs/dockview/options.js";
import { GlobalComponentNames, PanelComponentName, PanelModel, PanelParams } from "~/helper/GlobalComponents.js";
import { useWorkspaceStore } from "~/store/WorkspaceStore.js";
import { Logger } from "~/logger.js";
import * as Shared from "mod_companion_shared";
import * as uuid from "uuid";
import { Direction } from "dockview-core/dist/cjs/gridview/baseComponentGridview.js";

export const usePanelsStore = defineStore("panels", () => {
    const api = ref<DockviewApi>();
    const currentPanels = ref<IDockviewPanel[]>([]);
    const workspaceStore = useWorkspaceStore();
    const models = reactive<Map<string, PanelModel>>(new Map());

    watch(() => workspaceStore.activeWorkspace, deserialize);

    function handleReady(event: DockviewReadyEvent) {
        api.value = event.api;

        // deserialize();

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

    function spawnPanel<T extends PanelModel>(
        panelName: PanelComponentName,
        model: T,
        options?: Partial<AddPanelOptions>,
    ): IDockviewPanel | undefined {
        const panelId = panelName + ":" + uuid.v4();
        models.set(panelId, model);
        const op: AddPanelOptions<PanelParams<T>> = {
            ...options,
            id: panelId,
            component: panelName,
            tabComponent: GlobalComponentNames.PanelTab,
            params: { model, panelName, panelId, noClose: false },
        };

        return api.value?.addPanel(op);
    }

    function spawnPanelAtSimilar<T extends PanelModel>(
        panelName: PanelComponentName,
        model: T,
        defaultDirection: Direction,
    ): IDockviewPanel | undefined {
        const options: Partial<AddPanelOptions<PanelParams<T>>> = {};

        const existingPanelOfSameType = api.value?.panels?.find((p) => p.params?.panelName === panelName);
        if (existingPanelOfSameType) {
            options.position = { direction: "within", referencePanel: existingPanelOfSameType.id };
        } else {
            options.position = { direction: defaultDirection };
        }
        return spawnPanel(panelName, model, options);
    }

    function findOpenPanel(panelId: string): IDockviewPanel | undefined {
        return api.value?.panels.find((p) => p.id.startsWith(panelId));
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

    function getModel<T extends PanelModel>(panelId: string): T | undefined {
        return models.get(panelId) as T | undefined;
    }

    return { api, handleReady, spawnPanel, spawnPanelAtSimilar, getModel };
});
