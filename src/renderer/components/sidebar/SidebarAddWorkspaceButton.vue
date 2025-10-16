<template>
    <UButton
        label="Add Workspace"
        :icon="AppDesign.Icons.ActionAdd"
        color="neutral"
        variant="ghost"
        size="sm"
        @click="workspaceStore.createWorkspace()"
    />
</template>

<script setup lang="ts">
import { useWorkspaceStore } from "~/store/WorkspaceStore.js";
import { AppDesign } from "~/design/AppDesign.js";

const workspaceStore = useWorkspaceStore();
</script>

<style scoped></style>
