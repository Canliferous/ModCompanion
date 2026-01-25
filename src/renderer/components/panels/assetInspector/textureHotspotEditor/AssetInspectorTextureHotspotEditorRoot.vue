<template>
    <MPanelRoot>
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
                        <UCheckbox label="Show IDs" v-model="showIds" />
                    </UFormField>
                </div>
            </div>
        </div>
    </MPanelRoot>
</template>
<script setup lang="ts">
import { createHotspotEditor, HotspotEditMode, HotspotEditor } from "~/canvas/hotspotEditor/HotspotEditor.js";
import { SharedImageMetaReport } from "Shared/SharedImageMetaReport.js";
import { useElementSize, useMouseInElement, useMousePressed } from "@vueuse/core";
import { Logger } from "~/logger.js";
import { SharedLogChannel } from "Shared/SharedLogger.js";
import { AppDesign } from "~/design/AppDesign.js";
import { useRememberRef } from "~/composables/useRemember.js";

const id = useId();

const canvasRef = useTemplateRef("canvasRef");

const props = defineProps<{ meta: SharedImageMetaReport }>();

const { width, height } = useElementSize(canvasRef);
const editMode = useRememberRef(ref(HotspotEditMode.Select), "hotspot-editor-mode");
const showIds = useRememberRef(ref(false), "hotspot-editor-show-ids");

// TODO: Feed this from main process
const scalingFactor = 2;

onMounted(() => {
    const canvas = canvasRef.value;
    if (!canvas) {
        return;
    }

    const ctx = canvas.getContext("2d")!;
    const editor = createHotspotEditor(ctx, 1000, 1000);

    updateEditorTexture(props.meta, editor);

    const { elementX, elementY } = useMouseInElement(canvasRef);
    useMousePressed({
        target: canvasRef,
        onPressed: (event) => {
            if ((event as any).buttons !== undefined) {
                const mouseEvent = event as MouseEvent;
                if (mouseEvent.buttons === 1) {
                    editor.updateMouse1Pressed(true);
                } else if (mouseEvent.buttons === 2) {
                    editor.updateMouse2Pressed(true);
                }
            }
        },
        onReleased: () => {
            editor.updateMouse1Pressed(false);
            editor.updateMouse2Pressed(false);
        },
    });
    watch(elementX, (x) => editor.updateMouseX(x * scalingFactor));
    watch(elementY, (y) => editor.updateMouseY(y * scalingFactor));
    watch(width, (w) => {
        if (canvasRef.value) {
            canvasRef.value.width = w * scalingFactor;
        }
        editor.updateRealWidth(w * scalingFactor);
    });
    watch(height, (h) => {
        if (canvasRef.value) {
            canvasRef.value.height = h * scalingFactor;
        }
        editor.updateRealHeight(h * scalingFactor);
    });

    watch(props.meta, (m) => {
        updateEditorTexture(m, editor);
    });

    watch(editMode, editor.updateEditMode);
    watch(showIds, editor.updateShowIds);
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
