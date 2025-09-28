<template>
    <UButton
        label="Add Workspace"
        icon="tdesign:add"
        color="primary"
        variant="ghost"
        size="sm"
        @click="workspaceStore.createWorkspace()"
    />
</template>

<script setup lang="ts">
import { useWorkspaceStore } from "~/store/WorkspaceStore.js";

const workspaceStore = useWorkspaceStore();
</script>

<style scoped></style>
