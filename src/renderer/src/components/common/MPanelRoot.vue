<template>
    <div class="w-full h-full grid grid-cols-1 relative" :style="rowStyle">
        <div v-if="slots.header" class="p-2 border-b border-b-accented">
            <slot name="header" />
        </div>
        <div class="relative h-full">
            <div
                ref="scroller"
                class="p-2 pr-1 h-full"
                :class="noScroll ? 'overflow-y-hidden' : alwaysShowScroll ? 'overflow-y-scroll' : 'overflow-y-auto'"
            >
                <slot />
            </div>

            <div class="_scroll-gradient-top" :class="{ 'opacity-0': arrivedState.top }">
                <div class="_scroll-gradient-corner _scroll-gradient-corner__top-left"></div>
                <div class="_scroll-gradient-edge__top"></div>
                <div class="_scroll-gradient-corner _scroll-gradient-corner__top-right"></div>
            </div>
            <div class="_scroll-gradient-bottom" :class="{ 'opacity-0': arrivedState.bottom }">
                <div class="_scroll-gradient-corner _scroll-gradient-corner__bottom-left"></div>
                <div class="_scroll-gradient-edge__bottom"></div>
                <div class="_scroll-gradient-corner _scroll-gradient-corner__bottom-right"></div>
            </div>
        </div>
        <div v-if="slots.footer" class="p-2 border-t border-t-accented">
            <slot name="footer" />
        </div>
    </div>
</template>

<script setup lang="ts">
// TODO: When there's no footer or header, the main content doesn't fill up the whole height
import { useScroll } from "@vueuse/core";

defineProps<{
    alwaysShowScroll?: boolean;
    noScroll?: boolean;
}>();

const slots = useSlots();

const rowStyle = computed(() => {
    let style = ``;
    if (slots.header) {
        style += "auto ";
    }

    style += `minmax(0, 1fr) `;

    if (slots.footer) {
        style += "auto ";
    }

    return `grid-template-rows: ${style}`;
});

const scrollerEl = useTemplateRef("scroller");
const { arrivedState } = useScroll(scrollerEl);
</script>

<style scoped>
._scroll-gradient-top,
._scroll-gradient-bottom {
    --_gradient-color: color-mix(in oklab, var(--color-neutral-950), transparent 25%);
    --_gradient-size: calc(var(--spacing) * 4);

    position: absolute;
    left: 0;
    right: 0;
    height: var(--_gradient-size);

    transition: opacity var(--default-transition-duration) var(--default-transition-timing-function);
    display: flex;
    justify-content: stretch;
    align-items: stretch;

    pointer-events: none;
}
._scroll-gradient-top {
    top: 0;
}
._scroll-gradient-bottom {
    bottom: 0;
}

._scroll-gradient-corner {
    width: var(--_gradient-size);
    /* 70% is such a cool magic number! this aligns the radial gradient with the linear one */
    background-image: radial-gradient(var(--_gradient-color) 0%, transparent 70%);
    background-size: 200% 200%;
    background-repeat: no-repeat;
}

._scroll-gradient-edge__top {
    flex-grow: 1;
    background-image: linear-gradient(var(--_gradient-color), transparent);
}
._scroll-gradient-edge__bottom {
    flex-grow: 1;
    background-image: linear-gradient(transparent, var(--_gradient-color));
}

._scroll-gradient-corner__top-left {
    background-position-y: calc(var(--_gradient-size) * -1);
}
._scroll-gradient-corner__top-right {
    background-position-x: calc(var(--_gradient-size) * -1);
    background-position-y: calc(var(--_gradient-size) * -1);
}
._scroll-gradient-corner__bottom-left {
}
._scroll-gradient-corner__bottom-right {
    background-position-x: calc(var(--_gradient-size) * -1);
}
</style>
