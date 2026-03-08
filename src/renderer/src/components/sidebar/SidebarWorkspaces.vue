<template>
    <div class="grid w-full gap-1 grid-cols-1" :class="{ 'pt-1': workspaceStore.workspaces.length >= 1 }">
        <template v-for="id in workspaceStore.workspaces" :key="id">
            <SidebarWorkspacesItem :id="id" />
        </template>
    </div>
</template>

<script setup lang="ts">
import { useWorkspaceStore } from "~/store/WorkspaceStore.js";

const workspaceStore = useWorkspaceStore();
</script>

<style scoped></style>
