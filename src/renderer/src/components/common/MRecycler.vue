<template>
    <div
        ref="parent"
        class="w-full h-full overflow-y-scroll grid pr-2"
        :class="{ 'col-span-full grid-cols-subgrid': subgrid }"
    >
        <div
            class="h-full w-full grid content-start"
            :class="{ 'col-span-full grid-cols-subgrid': subgrid }"
            :style="containerStyle"
        >
            <template v-for="i in domItemCount" :key="i">
                <div
                    v-if="startIndex + i < items.length"
                    class="grid"
                    :style="`height: ${rowHeight}px; translate: 0px ${props.rowHeight * startIndex + i - 1}px`"
                    :class="{ 'col-span-full grid-cols-subgrid': subgrid }"
                >
                    <slot :item="items[startIndex + i - 1]" :idx="startIndex + i - 1" />
                </div>
            </template>
        </div>
    </div>
</template>

<script setup lang="ts" generic="T extends Record<string, any>">
import { useResizeObserver, useScroll } from "@vueuse/core";

const props = defineProps<{ items: T[]; rowHeight: number; subgrid: boolean; keyField: string }>();

defineSlots<{
    default(props: { item: T; idx: number }): any;
}>();

const parentEl = useTemplateRef("parent");

const domItemCount = ref(0);
const containerStyle = computed(() => `height: ${props.rowHeight * props.items.length}px`);
const startIndex = computed(() => Math.floor(y.value / props.rowHeight));

const { y } = useScroll(parentEl);

useResizeObserver(parentEl, (entries) => {
    const height = entries[0].contentRect.height;
    computeDom(height, props.rowHeight, props.items.length);
});
watchEffect(() => {
    const height = parentEl.value?.clientHeight;
    if (!height) return;
    computeDom(height, props.rowHeight, props.items.length);
});

function computeDom(parentHeight: number, rowHeight: number, itemCount: number) {
    const fitCount = Math.ceil(parentHeight / rowHeight);
    domItemCount.value = Math.min(itemCount, fitCount);
}
</script>

<style scoped></style>
