<template>
    <div class="grid gap-1 w-full grid-cols-1">
        <div class="aspect-square relative">
            <img src="/img/chamber_sign/chamber_sign_basecolor.png" class="absolute" />
            <img :src="iconImgSrc" class="absolute" :class="{ 'opacity-25': !model.active }" />
            <UCheckbox v-model="model.active" class="absolute top-2 left-2" color="primary" size="xl" />
        </div>
        <USelect
            v-model="model.name"
            size="sm"
            :items="Shared.ChamberSignConfig.SharedChamberSignIcons"
            class="max-w-full overflow-x-clip text-ellipsis"
        />
    </div>
</template>

<script setup lang="ts">
import * as Shared from "mod_companion_shared";

const model = defineModel<Shared.ChamberSignConfig.SharedChamberSignConfigMapSignIcon>({ required: true });

const iconImgSrc = computed(
    () => `./img/chamber_sign_icons/sign_${Shared.ChamberSignConfig.getChamberSignIconImageName(model.value.name)}.png`,
);
</script>

<style scoped></style>
