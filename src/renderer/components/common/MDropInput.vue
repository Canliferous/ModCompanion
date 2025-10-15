<template>
    <MAcceptDrop v-model="model">
        <template v-slot="{ isOverDropZone }">
            <UInput
                v-model="model"
                @change="emit('change', model ?? '')"
                :highlight="isOverDropZone"
                :placeholder="placeholder"
                class="w-full"
            />
        </template>
    </MAcceptDrop>
</template>

<script setup lang="ts">
const model = defineModel<string>("");
const emit = defineEmits<{ change: [string] }>();
const props = defineProps<{ placeholder?: string }>();
</script>

<style scoped></style>
