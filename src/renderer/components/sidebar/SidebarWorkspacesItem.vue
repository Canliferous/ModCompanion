<template>
    <div class="flex w-full group" ref="btnGroup">
        <UButton
            :label="label || '(unknown)'"
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
                :icon="AppDesign.Icons.ChevronRight"
                class="hidden group-hover:flex"
            />

            <template #content>
                <div class="p-2 grid gap-2">
                    <UInput placeholder="Workspace Name..." v-model="label" @keydown="handleNameKeydown" />
                    <div class="flex gap-1">
                        <UButton
                            label="Duplicate"
                            block
                            size="sm"
                            variant="ghost"
                            color="info"
                            :icon="AppDesign.Icons.Copy"
                            @click="handleDuplicate"
                        />
                        <UButton
                            label="Delete"
                            block
                            size="sm"
                            variant="ghost"
                            color="error"
                            :icon="AppDesign.Icons.ActionRemove"
                            @click="handleDelete"
                        />
                    </div>
                </div>
            </template>
        </UPopover>
    </div>
</template>

<script setup lang="ts">
import { useWorkspaceStore, WorkspaceId } from "~/store/WorkspaceStore.js";
import { AppDesign } from "~/design/AppDesign.js";

const props = defineProps<{ id: WorkspaceId }>();
const workspaceStore = useWorkspaceStore();

const btnGroup = ref();

const open = ref(false);

const label = ref(workspaceStore.workspaceLabels[props.id]);
watch(label, (v) => {
    workspaceStore.updateLabel(props.id, v);
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
</script>

<style scoped></style>
