<template>
    <div class="grid w-full gap-1 grid-cols-1">
        <template v-for="id in workspaceStore.workspaces">
            <SidebarWorkspacesItem :id="id" />
        </template>
    </div>
</template>

<script setup lang="ts">
import { useWorkspaceStore } from "~/store/WorkspaceStore.js";

const workspaceStore = useWorkspaceStore();
</script>

<style scoped></style>
