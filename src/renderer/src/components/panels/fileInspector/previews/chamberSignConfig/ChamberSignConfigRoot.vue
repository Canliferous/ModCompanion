<template>
    <div class="grid grid-cols-[1fr_2fr] gap-2">
        <div class="tabular-nums">
            <UTree :items="items" />
        </div>
        <ChamberSignConfigSign v-if="selectedSign" v-model="selectedSign" />
    </div>
</template>

<script setup lang="ts">
import { TreeItem } from "@nuxt/ui/components/Tree.vue.js";
import * as Shared from "mod_companion_shared";

const model = defineModel<Shared.ChamberSignConfig.SharedChamberSignConfig>({ required: true });

const selectedSign = ref<Shared.ChamberSignConfig.SharedChamberSignConfigMapSign | undefined>(undefined);

const items = computed<TreeItem[]>(() => {
    return model.value.maps.map((m, mapIndex) => {
        return {
            label: m.name,
            children: m.signs.map<TreeItem>((s, signIndex) => ({
                label: `${signIndex}: ${s.name || "(Empty Name)"} ${s.current_level}/${s.total_levels}`,
                onSelect(e) {
                    selectedSign.value = model.value.maps[mapIndex].signs[signIndex];
                },
            })),
            defaultExpanded: true,
        };
    });
});
</script>

<style scoped></style>
