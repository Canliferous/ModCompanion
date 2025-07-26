<template>
    <div class="flex">
        <UInput v-model="text" variant="ghost" class="grow" :placeholder @blur="emit('changed', text)" />
        <UButton variant="ghost" icon="tdesign:minus" color="error" @click="emit('remove')" />
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{ entry: string }>();
const text = ref(props.entry);

const emit = defineEmits<{
    remove: [void];
    changed: [newVal: string];
}>();

const placeholder = `Enter path...`;
</script>

<style scoped></style>
