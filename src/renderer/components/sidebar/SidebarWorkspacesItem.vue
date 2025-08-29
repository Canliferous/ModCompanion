<template>
    <UButtonGroup class="w-full group">
        <UButton
            :label="label || '(unknown)'"
            :icon="icon || 'nothing'"
            variant="soft"
            size="sm"
            class="overflow-x-hidden text-ellipsis grow text-xs"
            :color="workspaceStore.activeWorkspace === id ? 'primary' : 'neutral'"
            @click="() => workspaceStore.activateWorkspace(id)"
        />

        <UPopover v-model:open="open" :content="{ side: 'right', align: 'start' }">
            <UButton
                size="sm"
                variant="soft"
                :color="workspaceStore.activeWorkspace === id ? 'primary' : 'neutral'"
                icon="tdesign:chevron-right"
                class="hidden group-hover:flex"
            />

            <template #content>
                <div class="p-2 grid gap-2">
                    <UInput
                        placeholder="Workspace Name..."
                        variant="ghost"
                        v-model="label"
                        @keydown="handleNameKeydown"
                    />
                    <UButton
                        label="Delete"
                        block
                        variant="ghost"
                        color="error"
                        icon="tdesign:delete"
                        @click="handleDelete"
                    />
                </div>
            </template>
        </UPopover>
    </UButtonGroup>
</template>

<script setup lang="ts">
import { useWorkspaceStore, WorkspaceId } from "~/store/WorkspaceStore.js";

const props = defineProps<{ id: WorkspaceId }>();
const workspaceStore = useWorkspaceStore();

const open = ref(false);

const label = ref(workspaceStore.workspaceLabels[props.id]);
const icon = ref(workspaceStore.workspaceIcons[props.id]);

watch(label, (v) => {
    workspaceStore.updateLabel(props.id, v);
});
watch(icon, (v) => {
    workspaceStore.updateIcon(props.id, v);
});

function handleContextMenu() {
    open.value = true;
}

function handleDelete() {
    workspaceStore.deleteWorkspace(props.id);
}

function handleNameKeydown(e: KeyboardEvent) {
    if (e.key === "Enter") {
        open.value = false;
    }
}
</script>

<style scoped></style>
