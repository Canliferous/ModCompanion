<template>
    <div ref="grid" class="grid grid-cols-3 h-full" :style="gridStyle">
        <template v-for="(node, i) in nodes" :key="i">
            <component :is="node" />
            <template v-if="i < nodes!.length - 1">
                <div
                    class="bg-neutral-700"
                    :class="{ 'cursor-n-resize h-1': vertical, 'cursor-w-resize w-1': !vertical }"
                    @mousedown="(event) => handleDown(event, i)"
                />
            </template>
        </template>
    </div>
</template>

<script setup lang="ts">
import { useSlots } from "vue";
import { useElementBounding } from "@vueuse/core";

const HANDLE_SIZE = 8;

interface Sizes {
    minSize?: number;
    maxSize?: number;
}
const props = defineProps<{ vertical?: boolean; sizes?: Sizes[] }>();
const slots = useSlots();
const nodes = slots.default?.();
const splitSizes = reactive<number[]>(new Array(nodes?.length ?? 0).fill(0));

onMounted(() => {
    const sizesSum = splitSizes.reduce((v, accum) => v + accum, 0);
    if (sizesSum === 0) {
        const equalSplit = (props.vertical ? height.value : width.value) / splitSizes.length;
        for (let i = 0; i < splitSizes.length; i++) {
            splitSizes[i] = equalSplit;
        }
    }
});

const resizingHandleIdx = ref<number | undefined>(undefined);

const gridStyle = computed(() => {
    let style = props.vertical ? "grid-template-rows: " : "grid-template-columns: ";
    let index = 0;
    for (const splitSize of splitSizes) {
        if (splitSize <= 0) {
            style += "1fr ";
        } else {
            style += splitSize + "px ";
        }
        if (index++ < splitSizes.length - 1) {
            style += HANDLE_SIZE + "px ";
        }
    }

    return style;
});

const gridRef = useTemplateRef("grid");
const { width, height, x, y } = useElementBounding(gridRef);

function handleDown(event: MouseEvent, handleIdx: number): void {
    if (resizingHandleIdx.value !== undefined) return;
    resizingHandleIdx.value = handleIdx;
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleStop);
}

function handleMove(event: MouseEvent) {
    const handleIdx = resizingHandleIdx.value;
    if (handleIdx === undefined) return;
    let pos = 0;
    if (props.vertical) {
        pos = event.clientY - y.value;
    } else {
        pos = event.clientX - x.value;
    }

    let sumOfPrevSplits = 0;
    if (handleIdx > 0) {
        for (let i = 0; i < handleIdx; i++) {
            sumOfPrevSplits += splitSizes[i] + HANDLE_SIZE;
        }
    }
    let size = pos - sumOfPrevSplits;

    if (props.sizes && props.sizes.length > handleIdx) {
        const sizes = props.sizes[handleIdx];
        if (sizes.minSize) {
            size = Math.max(size, sizes.minSize);
        }
        if (sizes.maxSize) {
            size = Math.min(size, sizes.maxSize);
        }
    }

    const oldSize = splitSizes[handleIdx];
    const delta = size - oldSize;

    const handlesCount = nodes?.length ?? 0;

    const newSizes = structuredClone(toRaw(splitSizes));
    for (let i = 0; i < handlesCount; i++) {
        if (i === handleIdx) {
            newSizes[i] = size;
            continue;
        }

        let adjustment = delta / (handlesCount - 1);
        if (i > handleIdx) {
            adjustment *= -1;
        }
        const newSize = splitSizes[i];
        newSizes[i] = newSize + adjustment;
    }

    const resolvedSizes = resolveConstraints(newSizes);
    for (let i = 0; i < resolvedSizes.length; i++) {
        splitSizes[i] = resolvedSizes[i];
    }
}

function resolveConstraints(sizes: number[]): number[] {
    if (!props.sizes) return sizes;
    let additionalSize = 0;
    const newSizes = structuredClone(sizes);
    for (let i = 0; i < sizes.length; i++) {
        let size = sizes[i];
        const originalSize = size;
        const minSize = getMinSize(i);
        const maxSize = getMaxSize(i);
        if (minSize) {
            size = Math.max(minSize, size);
        }
        if (maxSize) {
            size = Math.min(maxSize, size);
        }

        additionalSize += size - originalSize;
    }

    console.log(sizes, newSizes);

    // if (additionalSize > 0) {
    //     const sizeIdxWithoutMaxSize: number[] = [];
    //     for (let i = 0; i < props.sizes.length; i++) {
    //         if (!props.sizes[i].maxSize) {
    //             sizeIdxWithoutMaxSize.push(i);
    //         }
    //     }
    //
    //     const sizeToAdd = additionalSize / sizeIdxWithoutMaxSize.length;
    //     for (const idx of sizeIdxWithoutMaxSize) {
    //         newSizes[idx] += sizeToAdd;
    //     }
    // } else if (additionalSize < 0) {
    //     const sizeIdxWithoutMinSize: number[] = [];
    //     for (let i = 0; i < props.sizes.length; i++) {
    //         if (!props.sizes[i].minSize) {
    //             sizeIdxWithoutMinSize.push(i);
    //         }
    //     }
    //
    //     const sizeToRemove = additionalSize / sizeIdxWithoutMinSize.length;
    //     for (const idx of sizeIdxWithoutMinSize) {
    //         newSizes[idx] -= sizeToRemove;
    //     }
    // }

    return newSizes;
}

function getMinSize(handleIdx: number): number {
    if (props.sizes && props.sizes.length > handleIdx) {
        return props.sizes[handleIdx].minSize ?? 0;
    } else return 0;
}

function getMaxSize(handleIdx: number): number {
    if (props.sizes && props.sizes.length > handleIdx) {
        return props.sizes[handleIdx].maxSize ?? 0;
    } else return 0;
}

function handleStop(event: MouseEvent): void {
    resizingHandleIdx.value = undefined;
    window.removeEventListener("mousemove", handleMove);
    window.removeEventListener("mouseup", handleStop);
}
</script>

<style scoped></style>
