<template>
    <UCheckbox :id="useId()" v-model="randomRotation" label="Random Rotation" @change="handleChanged" />
    <UCheckbox
        :id="useId()"
        v-model="randomReflection"
        label="Random Reflection (Not implemented in the engine)"
        @change="handleChanged"
    />
    <UCheckbox :id="useId()" v-model="isAlternative" label="Is Alternate" @change="handleChanged" />
</template>

<script setup lang="ts">
import * as Shared from "mod_companion_shared";

const props = defineProps<{ flags: Shared.Vtf.SharedVtfHotspotRectFlags | undefined }>();
const emit = defineEmits<{ changed: [Shared.Vtf.SharedVtfHotspotRectFlags] }>();

const randomRotation = ref(props.flags?.randomRotation || false);
const randomReflection = ref(props.flags?.randomReflection || false);
const isAlternative = ref(props.flags?.isAlternative || false);

watch(
    () => props.flags,
    (flags) => {
        randomRotation.value = flags?.randomRotation || false;
        randomReflection.value = flags?.randomReflection || false;
        isAlternative.value = flags?.isAlternative || false;
    },
);

function handleChanged() {
    emit("changed", {
        randomRotation: randomRotation.value,
        randomReflection: randomReflection.value,
        isAlternative: isAlternative.value,
    });
}
</script>

<style scoped></style>
