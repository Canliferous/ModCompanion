<template>
    <MPanelRoot>
        <div class="grid grid-cols-2 gap-1 text-xs">
            <template v-for="item in items">
                <div class="grid grid-cols-2 bg-elevated rounded px-2.5 py-1.5">
                    <span class="text-muted">
                        {{ item.name }}
                    </span>
                    <span>{{ item.value.value }}</span>
                </div>
            </template>
        </div>
    </MPanelRoot>
</template>

<script setup lang="ts">
import { SharedImageMetaReport } from "Shared/SharedImageMetaReport.js";
import { computed } from "vue";

const props = defineProps<{ meta: SharedImageMetaReport }>();

const items = computed(() =>
    Object.entries(props.meta.tags ?? {})
        .map((entry) => ({ name: entry[0], value: entry[1] }))
        .sort((a, b) => a.name.localeCompare(b)),
);
</script>

<style scoped></style>
