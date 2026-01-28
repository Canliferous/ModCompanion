<template>
    <MPanelRoot always-show-scroll>
        <div class="grid grid-cols-1 content-start gap-1">
            <div class="aspect-square">
                <canvas :id="id" ref="canvasRef" width="1000" height="1000" class="h-full w-full" />
            </div>

            <div class="p-1">
                <div class="grid grid-cols-[auto_1fr] gap-2">
                    <UFormField label="Mode">
                        <UButtonGroup>
                            <UButton
                                label="Select & Modify"
                                :icon="AppDesign.Icons.ActionSelectCursor"
                                :color="editMode === HotspotEditMode.Select ? 'info' : 'neutral'"
                                @click="editMode = HotspotEditMode.Select"
                            />
                            <UButton
                                label="Draw"
                                :icon="AppDesign.Icons.ActionEditPencil"
                                :color="editMode === HotspotEditMode.Draw ? 'info' : 'neutral'"
                                @click="editMode = HotspotEditMode.Draw"
                            />
                            <UButton
                                label="Delete"
                                :icon="AppDesign.Icons.ActionDelete"
                                :color="editMode === HotspotEditMode.Delete ? 'info' : 'neutral'"
                                @click="editMode = HotspotEditMode.Delete"
                            />
                        </UButtonGroup>
                    </UFormField>
                    <UFormField label="View">
                        <UCheckbox v-model="showIds" label="Show IDs" />
                    </UFormField>
                    <UFormField
                        v-if="editMode === HotspotEditMode.Select && selectedRectIdx !== undefined"
                        label="Selected Rect"
                    >
                        <AssetInspectorTextureHotspotEditorFlags :flags="selectedRectFlags" @changed="handleChanged" />
                    </UFormField>
                </div>
            </div>
        </div>
    </MPanelRoot>
</template>
<script setup lang="ts">
import createHotspotEditor, { HotspotEditMode, HotspotEditor } from "~/canvas/hotspotEditor/HotspotEditor.js";
import { SharedImageMetaReport } from "Shared/SharedImageMetaReport.js";
import { useElementSize, useMouseInElement, useMousePressed } from "@vueuse/core";
import { Logger } from "~/logger.js";
import { SharedLogChannel } from "Shared/SharedLogger.js";
import { AppDesign } from "~/design/AppDesign.js";
import { useRememberRef } from "~/composables/useRemember.js";
import { SharedTextureAsset } from "Shared/SharedAssetDefinition.js";
import { useAssetListStore } from "~/store/AssetListStore.js";
import { SharedVtfCreateOptions } from "Shared/vtf/SharedVtf.js";
import { SharedVtfHotspotRectFlags } from "Shared/vtf/SharedVtfHotspotRect.js";

const id = useId();

const canvasRef = useTemplateRef("canvasRef");

const props = defineProps<{ meta: SharedImageMetaReport; asset: SharedTextureAsset }>();

const { width, height } = useElementSize(canvasRef);
const editMode = useRememberRef(ref(HotspotEditMode.Select), "hotspot-editor-mode");
const showIds = useRememberRef(ref(false), "hotspot-editor-show-ids");

const selectedRectIdx = ref<number | undefined>(undefined);
const selectedRectFlags = ref<SharedVtfHotspotRectFlags | undefined>(undefined);

function handleChanged(flags: SharedVtfHotspotRectFlags) {
    if (selectedRectIdx.value) {
        editor.value?.updateRectFlags(selectedRectIdx.value, toRaw(flags));
    }
}

// TODO: Feed this from main process
const scalingFactor = 2;
const assetStore = useAssetListStore();

const editor = ref<HotspotEditor | undefined>(undefined);
onMounted(() => {
    const canvas = canvasRef.value;
    if (!canvas) {
        return;
    }

    const ctx = canvas.getContext("2d")!;
    editor.value = createHotspotEditor(ctx, 1000, 1000);
    editor.value.updateEditMode(editMode.value);
    editor.value.updateShowIds(showIds.value);

    updateEditorTexture(props.meta, editor.value);

    const { elementX, elementY } = useMouseInElement(canvasRef);
    useMousePressed({
        target: canvasRef,
        onPressed: (event) => {
            if ((event as any).buttons !== undefined) {
                const mouseEvent = event as MouseEvent;
                if (mouseEvent.buttons === 1) {
                    editor.value?.updateMouse1Pressed(true);
                } else if (mouseEvent.buttons === 2) {
                    editor.value?.updateMouse2Pressed(true);
                }
            }
        },
        onReleased: () => {
            editor.value?.updateMouse1Pressed(false);
            editor.value?.updateMouse2Pressed(false);
        },
    });
    watch(elementX, (x) => editor.value?.updateMouseX(x * scalingFactor));
    watch(elementY, (y) => editor.value?.updateMouseY(y * scalingFactor));
    watch(width, (w) => {
        if (canvasRef.value) {
            canvasRef.value.width = w * scalingFactor;
        }
        editor.value?.updateRealWidth(w * scalingFactor);
    });
    watch(height, (h) => {
        if (canvasRef.value) {
            canvasRef.value.height = h * scalingFactor;
        }
        editor.value?.updateRealHeight(h * scalingFactor);
    });

    watch(
        () => props.meta,
        (m) => {
            updateEditorTexture(m, editor.value!);
        },
    );

    watch(
        () => props.asset,
        (asset) => {
            if (asset.def.vtfOptions?.hotspot) {
                editor.value?.updateRects(toRaw(asset.def.vtfOptions.hotspot));
            } else {
                editor.value?.updateRects([]);
            }
        },
    );
    if (props.asset.def.vtfOptions?.hotspot) {
        editor.value.updateRects(toRaw(props.asset.def.vtfOptions.hotspot));
    }

    watch(editMode, editor.value.updateEditMode);
    watch(showIds, editor.value.updateShowIds);

    editor.value.changedEvent.on((r) => {
        const options: SharedVtfCreateOptions = { ...toRaw(props.asset.def.vtfOptions), hotspot: r };

        const asset: SharedTextureAsset = {
            ...toRaw(props.asset),
            def: { ...toRaw(props.asset.def), vtfOptions: options },
        };
        assetStore.writeAssets([asset]);
    });

    editor.value.selectedEvent.on((rectAndIdx) => {
        selectedRectIdx.value = toRaw(rectAndIdx?.idx);
        selectedRectFlags.value = structuredClone(toRaw(rectAndIdx?.rect.flags));
    });
});

function updateEditorTexture(meta: SharedImageMetaReport, editor: HotspotEditor) {
    if (meta.filePath && meta.tags) {
        const w = meta.tags["Image Width"]?.value;
        const h = meta.tags["Image Height"]?.value;
        if (w && h) {
            editor.updateTexture(`file://${meta.filePath}`, w, h);
        }
    } else {
        Logger.warning(
            SharedLogChannel.Hotspot,
            "Updating hotspot editor texture failed. Image's meta is invalid: ",
            meta,
        );
    }
}
</script>

<style scoped></style>
