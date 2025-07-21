<template>
    <div class="grid grid-cols-6 gap-2">
        <div class="col-span-5 border border-accented p-2">
            <p class="text-xl">Launch</p>
            <div class="flex flex-wrap gap-2">
                <UButton
                    v-for="btn of launcherButtons"
                    :color="btn.color"
                    @click="() => launch(btn.launcherType, btn.launcherArgs)"
                    :label="btn.name"
                    variant="subtle"
                    size="xl"
                >
                    <template #leading>
                        <BitmapIcon :name="btn.icon" />
                    </template>
                </UButton>
            </div>
        </div>
        <div class="border border-accented p-2">
            <p class="text-xl">Utilities</p>
            <UButton @click="printConfig" variant="subtle" size="xl" block color="neutral">Print config</UButton>
        </div>
    </div>
</template>

<script setup lang="ts">
import { getAppConfig } from "~/renderer-config.js";
import BitmapIcon from "../common/BitmapIcon.vue";
import { launch, launcherButtons } from "~/model/LauncherButtons.js";

function printConfig() {
    console.log(getAppConfig());
}
</script>

<style scoped></style>
