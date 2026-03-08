<template>
    <div class="grid grid-cols-[1fr_2fr] gap-2">
        <div class="tabular-nums">
            <UTree :items="items" />
        </div>

        <div v-if="selectedSignIndex !== undefined && selectedMapIndex !== undefined" class="grid gap-2">
            <div class="grid gap-2 grid-cols-3">
                <UFormField label="Sign Display Name">
                    <UInput
                        v-model="model.maps[selectedMapIndex].signs[selectedSignIndex].name"
                        class="w-full"
                        placeholder="(Empty Name)"
                    />
                </UFormField>
                <UFormField label="Current Level">
                    <UInputNumber v-model="model.maps[selectedMapIndex].signs[selectedSignIndex].current_level" />
                </UFormField>
                <UFormField label="TotalLevel">
                    <UInputNumber v-model="model.maps[selectedMapIndex].signs[selectedSignIndex].total_levels" />
                </UFormField>
            </div>

            <div class="grid gap-2 grid-cols-5">
                <div
                    v-for="iconIndex in model.maps[selectedMapIndex].signs[selectedSignIndex].icons.length"
                    :key="iconIndex"
                >
                    <ChamberSignConfigIcon
                        v-model="model.maps[selectedMapIndex].signs[selectedSignIndex].icons[iconIndex - 1]"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import {
    SharedChamberSignConfig,
    SharedChamberSignConfigMap,
    SharedChamberSignConfigMapSign,
} from "Shared/SharedChamberSignConfig.js";
import { TreeItem } from "@nuxt/ui/components/Tree.vue.js";

const model = defineModel<SharedChamberSignConfig>({ required: true });

const selectedMapIndex = ref<number | undefined>(undefined);
const selectedSignIndex = ref<number | undefined>(undefined);

const items = computed<TreeItem[]>(() => {
    return model.value.maps.map((m, mapIndex) => {
        return {
            label: m.name,
            children: m.signs.map<TreeItem>((s, signIndex) => ({
                label: `${signIndex}: ${s.name || "(Empty Name)"} ${s.current_level}/${s.total_levels}`,
                onSelect(e) {
                    selectedMapIndex.value = mapIndex;
                    selectedSignIndex.value = signIndex;
                },
            })),
            defaultExpanded: true,
        };
    });
});
</script>

<style scoped></style>
