<template>
    <div class="flex items-center gap-1">
        <div v-if="depth !== undefined" :style="`width: ${depth + 1}rem`" />
        <MAssetTypeIcon :type />
        <div
            class="text-sm text-neutral-300 tracking-wide text-ellipsis overflow-hidden text-left"
            :dir="editing ? 'ltr' : 'rtl'"
        >
            <span>&lrm;</span>
            <span
                :contenteditable="editing ? 'plaintext-only' : 'false'"
                ref="nameEl"
                class="outline-0"
                @keydown="handleKeyDown"
                @blur="handleNameChanged"
            >
                {{ assetName }}
            </span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { SharedAssetId, SharedAssetType } from "Shared/SharedAssetDefinition.js";
import { useAssetListStore } from "~/store/AssetListStore.js";

const props = defineProps<{
    id: SharedAssetId;
    name: string;
    type: SharedAssetType;
    depth?: number;
    editing?: boolean;
}>();
const emit = defineEmits<{
    stopEditing: [void];
}>();

const nameRef = useTemplateRef("nameEl");

const assetName = ref(props.name);
watch(
    () => props.name,
    (newName) => (assetName.value = newName),
);

watch(
    () => props.editing,
    (ed) => {
        nextTick(() => {
            if (ed && nameRef.value) {
                const el = nameRef.value;
                el.focus();

                const range = document.createRange();
                range.selectNodeContents(el);

                const selection = window.getSelection();
                if (selection) {
                    selection.removeAllRanges();
                    selection.addRange(range);
                }
            }
        });
    },
);

function handleKeyDown(event: KeyboardEvent) {
    if (event.key === "Escape" || event.key === "Enter") {
        event.preventDefault();
        event.stopPropagation();
        emit("stopEditing");
    }

    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        event.stopPropagation();
    }
}

function handleNameChanged() {
    const newName = nameRef.value?.innerText;
    if (!newName) return;

    const asset = useAssetListStore().getAssetById(props.id);
    if (asset) {
        const newAsset = structuredClone(toRaw(asset));
        newAsset.def.displayName = newName;
        useAssetListStore().writeAssets([newAsset]);
    }
}
</script>

<style scoped></style>
