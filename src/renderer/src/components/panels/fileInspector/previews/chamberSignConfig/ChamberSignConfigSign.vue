<template>
    <div class="grid gap-2 content-start">
        <div class="grid gap-2 grid-cols-3 content-start">
            <UFormField label="Sign Display Name">
                <UInput v-model="model.name" class="w-full" placeholder="(Empty Name)" />
            </UFormField>
            <UFormField label="Current Level">
                <UInputNumber v-model="model.current_level" />
            </UFormField>
            <UFormField label="TotalLevel">
                <UInputNumber v-model="model.total_levels" />
            </UFormField>
        </div>

        <div class="grid gap-2 grid-cols-5">
            <div v-for="iconIndex in model.icons.length" :key="iconIndex">
                <ChamberSignConfigIcon v-model="model.icons[iconIndex - 1]" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import * as Shared from "mod_companion_shared";

const model = defineModel<Shared.ChamberSignConfig.SharedChamberSignConfigMapSign>({ required: true });
</script>

<style scoped></style>
