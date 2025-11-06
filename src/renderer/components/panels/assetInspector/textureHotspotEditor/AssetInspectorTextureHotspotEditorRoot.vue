<template>
    <div class="p-1 h-full">
        <canvas :id="id" width="1000" height="1000" class="w-full aspect-square" ref="canvasRef"></canvas>
    </div>
</template>
<script setup lang="ts">
import { createHotspotEditor } from "~/canvas/hotspotEditor/HotspotEditor.js";
import { SharedImageMetaReport } from "Shared/SharedImageMetaReport.js";
import { useMouseInElement } from "@vueuse/core";

const id = useId();

const canvasRef = useTemplateRef("canvasRef");

const props = defineProps<{ meta: SharedImageMetaReport }>();

onMounted(() => {
    const canvas = canvasRef.value;
    if (!canvas) {
        return;
    }

    const ctx = canvas.getContext("2d")!;
    const editor = createHotspotEditor(ctx, 1000, 1000);

    if (props.meta.data && props.meta.width && props.meta.height) {
        editor.updateTexture(props.meta.data, props.meta.width, props.meta.height);
    }

    const { elementX, elementY, isOutside } = useMouseInElement(canvasRef);
    watch(elementX, (x) => editor.updateMouseX(x));
    watch(elementY, (y) => editor.updateMouseY(y));

    watch(props.meta, (m) => {
        if (m.data && m.width && m.height) {
            editor.updateTexture(m.data, m.width, m.height);
        }
    });
});
</script>

<style scoped></style>
