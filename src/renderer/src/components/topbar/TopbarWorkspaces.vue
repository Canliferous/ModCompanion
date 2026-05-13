<template>
    <div class="flex gap-1">
        <template v-for="id in workspaceStore.workspaces" :key="id">
            <TopbarWorkspacesItem :id="id" />
        </template>

        <UTooltip text="New Workspace">
            <UButton
                :icon="AppDesign.Icons.ActionAdd"
                variant="link"
                size="xs"
                @click="workspaceStore.createWorkspace()"
            />
        </UTooltip>
    </div>
</template>

<script setup lang="ts">
import { AppDesign } from "~/design/AppDesign.js";
import { useWorkspaceStore } from "~/store/WorkspaceStore.js";

const workspaceStore = useWorkspaceStore();
</script>

<style scoped></style>
