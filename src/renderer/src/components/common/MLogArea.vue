<template>
    <MTextArea ref="scroller">
        {{ text }}
    </MTextArea>
</template>

<script setup lang="ts">
const props = defineProps<{ text: string }>();

const scroller = useTemplateRef("scroller");

watch(
    () => props.text,
    () => {
        nextTick(() => {
            if (scroller.value && scroller.value.rootEl) {
                scroller.value.rootEl.scrollTop = scroller.value.rootEl.scrollHeight;
            }
        });
    },
);
</script>

<style scoped></style>
