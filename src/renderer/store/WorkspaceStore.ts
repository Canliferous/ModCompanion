import { defineStore } from "pinia";
import { v4 } from "uuid";
import { useRememberReactive, useRememberStringArray } from "~/composables/useRemember.js";

export type WorkspaceId = string;

export function generateWorkspaceId(): string {
    return v4();
}

export const useWorkspaceStore = defineStore("workspace", () => {
    const workspaces = useRememberStringArray(ref<WorkspaceId[]>([]), "workspace-ids");
    const workspaceLabels = useRememberReactive(reactive(new Map<WorkspaceId, string>()), "workspace-labels");
    const workspaceIcons = useRememberReactive(reactive(new Map<WorkspaceId, string>()), "workspace-icons");
    const activeWorkspace = ref<WorkspaceId | undefined>();

    function createWorkspace() {
        const id = generateWorkspaceId();
        workspaces.value = [...workspaces.value, id];
        workspaceLabels.set(id, "New Workspace");
        workspaceIcons.set(id, "tdesign:heart");
        activeWorkspace.value = id;
        return id;
    }

    function deleteWorkspace(id: WorkspaceId) {
        const w = [...workspaces.value];
        w.splice(w.indexOf(id));
        workspaces.value = w;

        workspaceLabels.delete(id);
        workspaceIcons.delete(id);
    }

    function activateWorkspace(id: WorkspaceId) {
        activeWorkspace.value = id;
    }

    return {
        workspaces,
        workspaceLabels,
        workspaceIcons,
        activeWorkspace,
        createWorkspace,
        deleteWorkspace,
        activateWorkspace,
    };
});
