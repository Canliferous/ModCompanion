<template>
    <div class="grid gap-1">
        <div class="aspect-square relative">
            <img src="/chamber_sign/chamber_sign_basecolor.png" class="absolute" />
            <img :src="iconImgSrc" class="absolute" :class="{ 'opacity-25': !model.active }" />
            <UCheckbox v-model="model.active" class="absolute top-2 left-2" color="primary" size="xl" />
        </div>
        <USelect v-model="model.name" :items="SharedChamberSignIcons" />
    </div>
</template>

<script setup lang="ts">
import {
    getChamberSignIconImageName,
    SharedChamberSignConfigMapSignIcon,
    SharedChamberSignIcons,
} from "Shared/SharedChamberSignConfig.js";

const model = defineModel<SharedChamberSignConfigMapSignIcon>({ required: true });

const iconImgSrc = computed(() => `/chamber_sign_icons/sign_${getChamberSignIconImageName(model.value.name)}.png`);
</script>

<style scoped></style>
