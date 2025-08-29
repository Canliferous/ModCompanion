import { defineStore } from "pinia";
import { v4 } from "uuid";
import { useRememberRef, useRememberStringArray } from "~/composables/useRemember.js";
import { SerializedDockview } from "dockview-vue";

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

    function createWorkspace() {
        const id = generateWorkspaceId();
        workspaces.value = [...workspaces.value, id];
        workspaceLabels.value = { ...workspaceLabels.value, [id]: "New Workspace" };
        workspaceIcons.value = { ...workspaceIcons.value, [id]: "New Workspace" };
        activeWorkspace.value = id;
        return id;
    }

    function deleteWorkspace(id: WorkspaceId) {
        const w = [...workspaces.value];
        w.splice(w.indexOf(id));
        workspaces.value = w;

        workspaceLabels.value = { ...workspaceLabels.value, [id]: undefined };
        workspaceIcons.value = { ...workspaceIcons.value, [id]: undefined };
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

    return {
        workspaces,
        workspaceLabels,
        workspaceIcons,
        workspacePanels,
        activeWorkspace,
        createWorkspace,
        deleteWorkspace,
        activateWorkspace,
        updateLabel,
        updateIcon,
    };
});
