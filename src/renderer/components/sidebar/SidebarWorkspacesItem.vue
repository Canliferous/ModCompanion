<template>
    <UButtonGroup class="w-full group" ref="btnGroup">
        <UButton
            :label="label || '(unknown)'"
            :icon="icon || 'nothing'"
            :variant="workspaceStore.activeWorkspace === id ? 'subtle' : 'ghost'"
            size="sm"
            class="overflow-x-hidden text-ellipsis grow text-xs"
            color="neutral"
            @click="() => workspaceStore.activateWorkspace(id)"
        />

        <UPopover v-model:open="open" :content="{ side: 'right', align: 'start' }" :reference="btnGroup">
            <UButton
                size="sm"
                variant="soft"
                color="neutral"
                icon="tdesign:chevron-right"
                class="hidden group-hover:flex"
            />

            <template #content>
                <div class="p-2 grid gap-2">
                    <UInput placeholder="Workspace Name..." v-model="label" @keydown="handleNameKeydown" />
                    <UInput placeholder="Icon Name" v-model="icon" @keydown="handleIconDown" />
                    <div class="flex gap-1">
                        <UButton
                            label="Duplicate"
                            block
                            size="sm"
                            variant="ghost"
                            color="info"
                            icon="tdesign:copy"
                            @click="handleDuplicate"
                        />
                        <UButton
                            label="Delete"
                            block
                            size="sm"
                            variant="ghost"
                            color="error"
                            icon="tdesign:delete"
                            @click="handleDelete"
                        />
                    </div>
                </div>
            </template>
        </UPopover>
    </UButtonGroup>
</template>

<script setup lang="ts">
import { useWorkspaceStore, WorkspaceId } from "~/store/WorkspaceStore.js";

const props = defineProps<{ id: WorkspaceId }>();
const workspaceStore = useWorkspaceStore();

const btnGroup = ref();

const open = ref(false);

const label = ref(workspaceStore.workspaceLabels[props.id]);
const icon = ref(workspaceStore.workspaceIcons[props.id]);

watch(label, (v) => {
    workspaceStore.updateLabel(props.id, v);
});
watch(icon, (v) => {
    workspaceStore.updateIcon(props.id, v);
});

function handleDuplicate() {
    workspaceStore.duplicateWorkspace(props.id);
}
function handleDelete() {
    workspaceStore.deleteWorkspace(props.id);
}

function handleNameKeydown(e: KeyboardEvent) {
    if (e.key === "Enter") {
        open.value = false;
    }
}
const handleIconDown = handleNameKeydown;
</script>

<style scoped></style>
