<template>
    <UButton variant="ghost" size="sm" label="Build FGD" @click="fgdStore.buildFgd()">
        <template #leading>
            <UIcon :name="icon" :class="{ 'animate-spin': fgdStore.building }" />
        </template>
    </UButton>
</template>
<script setup lang="ts">
import { AppDesign } from "~/design/AppDesign.js";
import { useFgdStore } from "~/store/FgdStore.js";

const fgdStore = useFgdStore();

const icon = computed(() => {
    if (fgdStore.building) {
        return AppDesign.Icons.Loading;
    }
    if (fgdStore.result === true) {
        return AppDesign.Icons.Check;
    }
    if (fgdStore.result === false) {
        return AppDesign.Icons.Close;
    }

    return AppDesign.Icons.ActionPlay;
});
</script>

<style scoped></style>
