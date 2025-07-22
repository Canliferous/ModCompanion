<script setup lang="ts">
import { ref } from "vue";
import pathe from "pathe";
import { ContextMenuItem } from "@nuxt/ui/components/ContextMenu.vue.js";

const props = defineProps<{ file: string; filesRoot: string }>();
const items = ref<ContextMenuItem[]>([
    {
        label: "Browse to file",
        icon: "tdesign:file-code-1",
        onSelect(e: Event) {
            onBrowse();
        },
    },
]);

function onOpen() {
    const filePath = pathe.join(props.filesRoot, props.file);
    window.electronAPI.app.openFile(filePath);
}
function onBrowse() {
    const filePath = pathe.join(props.filesRoot, props.file);
    window.electronAPI.app.browseToFile(filePath);
}
</script>

<template>
    <UContextMenu :items="items">
        <!--        <UTooltip text="Click to Open">-->
        <UButton class="justify-start" variant="ghost" block color="neutral" size="sm" @click="onOpen">
            <span class="font-mono">
                {{ file }}
            </span>
        </UButton>
        <!--        </UTooltip>-->
    </UContextMenu>
</template>

<style scoped></style>
