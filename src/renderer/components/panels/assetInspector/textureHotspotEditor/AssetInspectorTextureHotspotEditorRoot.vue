<template>
    <div class="p-1 h-full grid grid-cols-1 grid-rows-1">
        <div class="aspect-square">
            <canvas :id="id" ref="canvasRef" width="1000" height="1000" class="h-full w-full" />
        </div>
    </div>
</template>
<script setup lang="ts">
import { createHotspotEditor, HotspotEditor } from "~/canvas/hotspotEditor/HotspotEditor.js";
import { SharedImageMetaReport } from "Shared/SharedImageMetaReport.js";
import { useElementSize, useMouseInElement, useMousePressed } from "@vueuse/core";
import { Logger } from "~/logger.js";
import { SharedLogChannel } from "Shared/SharedLogger.js";

const id = useId();

const canvasRef = useTemplateRef("canvasRef");

const props = defineProps<{ meta: SharedImageMetaReport }>();

const { width, height } = useElementSize(canvasRef);

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
