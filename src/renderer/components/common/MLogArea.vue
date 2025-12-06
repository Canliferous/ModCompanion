<template>
    <div
        class="h-full p-1 bg-neutral-900 border border-accented rounded inset-shadow-cave overflow-y-scroll overflow-x-clip"
        ref="scroller"
    >
        <pre class="whitespace-pre-wrap wrap-break-word text-xs text-neutral-300">{{ text }}</pre>
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{ text: string }>();

const scroller = useTemplateRef("scroller");

watch(
    () => props.text,
    () => {
        nextTick(() => {
            if (scroller.value) {
                scroller.value.scrollTop = scroller.value.scrollHeight;
            }
        });
    },
);
</script>

<style scoped></style>
