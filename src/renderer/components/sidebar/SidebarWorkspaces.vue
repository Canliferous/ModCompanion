<template>
    <div class="flex flex-col w-full">
        <template v-for="id in workspaceStore.workspaces">
            <UContextMenu :items="getContextMenuOptions(id)">
                <UButton
                    :label="workspaceStore.workspaceLabels.get(id)"
                    :icon="workspaceStore.workspaceIcons.get(id)"
                    variant="soft"
                    size="xs"
                    :color="workspaceStore.activeWorkspace === id ? 'primary' : 'neutral'"
                    class="border-l-6"
                    :class="{ 'border-l-primary': workspaceStore.activeWorkspace === id }"
                    @click="() => workspaceStore.activateWorkspace(id)"
                />
            </UContextMenu>
        </template>

        <USeparator class="py-1" />

        <UButton
            label="New Workspace"
            icon="tdesign:add"
            size="xs"
            color="neutral"
            variant="ghost"
            @click="workspaceStore.createWorkspace()"
        />
    </div>
</template>

<script setup lang="ts">
import { useWorkspaceStore, WorkspaceId } from "~/store/WorkspaceStore.js";
import { ContextMenuItem } from "@nuxt/ui/components/ContextMenu.vue.js";

const workspaceStore = useWorkspaceStore();

function getContextMenuOptions(id: WorkspaceId): ContextMenuItem[][] {
    return [
        [
            {
                label: "Edit",
                icon: "tdesign:edit-1-filled",
            },
            {
                label: "Remove",
                color: "error",
                icon: "tdesign:remove",
                onSelect(e) {
                    workspaceStore.deleteWorkspace(id);
                },
            },
        ],
    ];
}
</script>

<style scoped></style>
