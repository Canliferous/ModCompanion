<template>
    <UContextMenu :items="items">
        <UButton
            :label="label || '(unknown)'"
            :variant="workspaceStore.activeWorkspace === id ? 'subtle' : 'soft'"
            size="sm"
            :color="workspaceStore.activeWorkspace === id ? 'primary' : 'neutral'"
            @click="() => workspaceStore.activateWorkspace(id)"
        />

        <template #content-top>
            <div class="p-1">
                <UInput placeholder="Workspace Name..." v-model="label" />
            </div>
        </template>
    </UContextMenu>
</template>

<script setup lang="ts">
import { useWorkspaceStore, WorkspaceId } from "~/store/WorkspaceStore.js";
import { AppDesign } from "~/design/AppDesign.js";
import { ContextMenuItem } from "@nuxt/ui/components/ContextMenu.vue.js";

const props = defineProps<{ id: WorkspaceId }>();
const workspaceStore = useWorkspaceStore();

const label = ref(workspaceStore.workspaceLabels[props.id]);
watch(label, (v) => {
    workspaceStore.updateLabel(props.id, v);
});

const items: ContextMenuItem[] = [
    {
        label: "Duplicate",
        icon: AppDesign.Icons.Copy,
        onSelect(e: Event) {
            workspaceStore.duplicateWorkspace(props.id);
        },
    },
    {
        label: "Delete",
        icon: AppDesign.Icons.ActionRemove,
        onSelect(e: Event) {
            workspaceStore.deleteWorkspace(props.id);
        },
    },
];
</script>

<style scoped></style>
