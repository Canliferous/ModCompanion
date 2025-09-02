import { defineStore } from "pinia";
import { v4 } from "uuid";
import { useRememberRef, useRememberStringArray } from "~/composables/useRemember.js";
import { SerializedDockview } from "dockview-vue";
import { useEventListener } from "@vueuse/core";

export type WorkspaceId = string;

export function generateWorkspaceId(): string {
    return v4();
}

export const useWorkspaceStore = defineStore("workspace", () => {
    const workspaces = useRememberStringArray(ref<WorkspaceId[]>([]), "workspace-ids");
    const workspaceLabels = useRememberRef(ref<Record<WorkspaceId, string | undefined>>({}), "workspace-labels");
    const workspaceIcons = useRememberRef(ref<Record<WorkspaceId, string | undefined>>({}), "workspace-icons");
    const activeWorkspace = useRememberRef(ref<WorkspaceId | undefined>(), "workspace-active");
    const workspacePanels = useRememberRef(ref<Record<WorkspaceId, SerializedDockview>>({}), "workspace-panels");

    useEventListener(document, "keydown", (e) => {
        if (!e.altKey) return;

        const numParsed = Number(e.key);
        if (Number.isNaN(numParsed)) return;

        const w = workspaces.value;
        if (numParsed > w.length && numParsed >= 0) return;

        const newId = w[numParsed - 1];
        activeWorkspace.value = newId;
    });

    function createWorkspace() {
        const id = generateWorkspaceId();
        workspaces.value = [...workspaces.value, id];
        workspaceLabels.value = { ...workspaceLabels.value, [id]: "New Workspace" };
        workspaceIcons.value = { ...workspaceIcons.value, [id]: "tdesign:heart" };
        activeWorkspace.value = id;
        return id;
    }

    function deleteWorkspace(id: WorkspaceId) {
        const w = [...workspaces.value];
        w.splice(w.indexOf(id));
        workspaces.value = w;

        workspaceLabels.value = { ...workspaceLabels.value, [id]: undefined };
        workspaceIcons.value = { ...workspaceIcons.value, [id]: undefined };

        if (w.length === 0) {
            activeWorkspace.value = undefined;
        } else {
            activeWorkspace.value = w[0];
        }
    }

    function duplicateWorkspace(id: WorkspaceId) {
        const newId = generateWorkspaceId();

        const oldLabel = workspaceLabels.value[id];
        const newLabel = `${oldLabel} (Copy)`;

        workspaces.value = [...workspaces.value, newId];
        workspaceLabels.value = { ...workspaceLabels.value, [newId]: newLabel };
        workspaceIcons.value = { ...workspaceIcons.value, [newId]: workspaceIcons.value[id] };
        workspacePanels.value = { ...workspacePanels.value, [newId]: workspacePanels.value[id] };
    }

    function activateWorkspace(id: WorkspaceId) {
        activeWorkspace.value = id;
    }

    function updateLabel(id: WorkspaceId, label: string | undefined): void {
        workspaceLabels.value = { ...workspaceLabels.value, [id]: label };
    }

    function updateIcon(id: WorkspaceId, icon: string | undefined): void {
        workspaceIcons.value = { ...workspaceIcons.value, [id]: icon };
    }

    function updatePanels(id: WorkspaceId, panels: SerializedDockview): void {
        workspacePanels.value = { ...workspacePanels.value, [id]: panels };
    }

    return {
        workspaces,
        workspaceLabels,
        workspaceIcons,
        workspacePanels,
        activeWorkspace,
        createWorkspace,
        deleteWorkspace,
        duplicateWorkspace,
        activateWorkspace,
        updateLabel,
        updateIcon,
        updatePanels,
    };
});
