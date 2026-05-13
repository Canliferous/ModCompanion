<template>
    <UContextMenu :items="items">
        <UButton
            :label="label || '(unknown)'"
            variant="ghost"
            size="sm"
            color="neutral"
            class="border-b-2 border-b-transparent pb-1"
            :class="{ 'border-b-primary-500 rounded-b-sm': workspaceStore.activeWorkspace === id }"
            @click="() => workspaceStore.activateWorkspace(id)"
        />

        <template #content-top>
            <div class="p-1">
                <UInput v-model="label" placeholder="Workspace Name..." @keydown.stop />
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
        onSelect() {
            workspaceStore.duplicateWorkspace(props.id);
        },
    },
    {
        label: "Delete",
        icon: AppDesign.Icons.ActionRemove,
        onSelect() {
            workspaceStore.deleteWorkspace(props.id);
        },
    },
];
</script>

<style scoped></style>
