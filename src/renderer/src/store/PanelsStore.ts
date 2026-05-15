import { defineStore } from "pinia";
import { DockviewApi, DockviewReadyEvent, IDockviewPanel } from "dockview-vue";
import { AddPanelOptions } from "dockview-core/dist/cjs/dockview/options.js";
import { GlobalComponentNames, PanelComponentName, PanelModel, PanelParams } from "~/helper/GlobalComponents.js";
import { useWorkspaceStore } from "~/store/WorkspaceStore.js";
import { Logger } from "~/logger.js";
import * as Shared from "mod_companion_shared";
import * as uuid from "uuid";
import { Direction } from "dockview-core/dist/cjs/gridview/baseComponentGridview.js";
import { useEventListener } from "@vueuse/core";
import { useRememberWorkspaceReactiveMap, useRememberWorkspaceRef } from "~/composables/useRemember.js";
import { configInitializedEvent } from "~/renderer-config.js";

export const usePanelsStore = defineStore("panels", () => {
    const api = ref<DockviewApi>();
    const currentPanels = ref<IDockviewPanel[]>([]);
    const workspaceStore = useWorkspaceStore();
    const models = useRememberWorkspaceReactiveMap(reactive<Map<string, PanelModel>>(new Map()), "panel-models");
    const activePanel = ref<string | undefined>();

    watch(() => workspaceStore.activeWorkspace, deserialize);

    useEventListener("keydown", (ev) => _relayKeyboardEventToActivePanel(ev));
    useEventListener("mousedown", (ev) => _relayClickEventToActivePanel(ev));

    // Deserialization needs to wait for the config to exist or some panels might try to read from it too soon and crash
    configInitializedEvent.on(() => {
        deserialize();
    });

    function handleReady(event: DockviewReadyEvent) {
        api.value = event.api;

        if (!api.value.getEdgeGroup("left")) {
            api.value.addEdgeGroup("left", {
                id: "left-group",
                collapsed: true,
                minimumSize: 200,
                initialSize: 350,
            });
        }

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
        event.api.onDidActivePanelChange(handleActivePanelChanged);
    }

    function handleActivePanelChanged(panel: IDockviewPanel | undefined): void {
        activePanel.value = panel?.id;
    }

    function spawnPanel<T extends PanelModel>(
        panelName: PanelComponentName,
        model: T,
        options?: Partial<AddPanelOptions>,
        params?: Partial<PanelParams>,
    ): IDockviewPanel | undefined {
        const panelId = panelName + ":" + uuid.v4();
        models.set(panelId, model);
        const op: AddPanelOptions<PanelParams> = {
            ...options,
            id: panelId,
            component: panelName,
            tabComponent: GlobalComponentNames.PanelTab,
            params: { panelName, panelId, noClose: false, temporary: false, ...params },
        };

        return api.value?.addPanel(op);
    }

    function spawnPanelAtSimilar<T extends PanelModel>(
        panelName: PanelComponentName,
        model: T,
        defaultDirection: Direction,
        params?: Partial<PanelParams>,
    ): IDockviewPanel | undefined {
        const options: Partial<AddPanelOptions<PanelParams>> = {};

        const existingPanelOfSameType = api.value?.panels?.find((p) => p.params?.panelName === panelName);
        if (existingPanelOfSameType) {
            options.position = { direction: "within", referencePanel: existingPanelOfSameType.id };
        } else {
            options.position = { direction: defaultDirection };
        }
        return spawnPanel(panelName, model, options, params);
    }

    function spawnTemporaryPanel<T extends PanelModel>(
        panelName: PanelComponentName,
        model: T,
        defaultDirection: Direction,
    ): IDockviewPanel | undefined {
        const existingPanelOfSameType = api.value?.panels?.find((p) => p.params?.panelName === panelName);
        if (existingPanelOfSameType?.params?.temporary) {
            models.set(existingPanelOfSameType.id, model);
            const panel = api.value?.getPanel(existingPanelOfSameType.id);
            if (panel) {
                panel.focus();
            }

            return;
        }

        return spawnPanelAtSimilar(panelName, model, defaultDirection, { temporary: true });
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
            Logger.warning(Shared.Log.Channel.Generic, "Failed to load layout", err);
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

    function makeNonTemporary(panelId: string): void {
        const panel = api.value?.getPanel(panelId);
        if (!panel) return;
        panel.update({ params: { ...panel.params, temporary: false } });
    }

    function _relayKeyboardEventToActivePanel(event: KeyboardEvent): void {
        const id = activePanel.value;
        if (!id) return;
        const panel = models.get(id);
        if (!panel) return;

        panel.onKeyInput?.call(event);
    }

    function _relayClickEventToActivePanel(event: MouseEvent): void {
        const id = activePanel.value;
        if (!id) return;
        const panel = models.get(id);
        if (!panel) return;

        panel.onClickInput?.call(event);
    }

    return {
        api,
        handleReady,
        spawnPanel,
        spawnPanelAtSimilar,
        spawnTemporaryPanel,
        getModel,
        makeNonTemporary,
    };
});
