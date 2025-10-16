<template>
    <UButton
        :icon="AppDesign.Icons.ActionAdd"
        variant="link"
        size="xs"
        class="p-0"
        @click="workspaceStore.createWorkspace()"
    />
</template>

<script setup lang="ts">
import { useWorkspaceStore } from "~/store/WorkspaceStore.js";
import { AppDesign } from "~/design/AppDesign.js";

const workspaceStore = useWorkspaceStore();
</script>

<style scoped></style>
