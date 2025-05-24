<template>
    <div class="grid grid-cols-[auto_10fr_repeat(6,1fr)_auto] gap-x-4">
        <div class="grid col-span-full grid-cols-subgrid items-center bg-elevated p-2 text-xs tracking-wider">
            <UCheckbox size="lg" />
            <div>Name</div>
            <div class="flex justify-center">VBSP</div>
            <div class="flex justify-center">POST</div>
            <div class="flex justify-center">VVIS</div>
            <div class="flex justify-center">VRAD</div>
            <div class="flex justify-center">CUBEMAP</div>
            <div class="flex justify-center">SUMMARY</div>
            <div></div>
        </div>

        <div
            class="grid col-span-full grid-cols-subgrid p-2 items-center border-b-1 border-accented"
            v-for="map in props.mapPaths"
        >
            <UCheckbox size="lg" />
            <div class="font-mono">
                {{ mapDisplayNames.get(map) }}
            </div>
            <div class="flex justify-center">
                <UIcon name="lucide:dot" />
            </div>
            <div class="flex justify-center">
                <UIcon name="lucide:dot" />
            </div>
            <div class="flex justify-center">
                <UIcon name="lucide:dot" />
            </div>
            <div class="flex justify-center">
                <UIcon name="lucide:dot" />
            </div>
            <div class="flex justify-center">
                <UIcon name="lucide:dot" />
            </div>
            <div class="flex justify-center">
                <UIcon name="lucide:dot" />
            </div>
            <div class="flex gap-2">
                <UButton icon="bx:play" color="info" variant="soft" @click="() => emit('addMapToQueue', map)" />
                <UButton icon="bx:minus" color="error" variant="soft" @click="() => emit('removeMap', map)" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import pathe from "pathe";
import { filename } from "pathe/utils";

const props = defineProps<{ mapPaths: string[] }>();

const emit = defineEmits<{ (e: "removeMap", mapPath: string): void; (e: "addMapToQueue", mapPath: string): void }>();

const mapDisplayNames = computed(() => {
    let prefix: string | undefined = undefined;
    let addPrefix = false;

    for (const p of props.mapPaths) {
        const dirName = pathe.dirname(p);
        if (prefix === undefined) {
            prefix = dirName;
        } else if (prefix !== dirName) {
            addPrefix = true;
            break;
        }
    }

    const map = new Map<string, string>();
    for (const p of props.mapPaths) {
        const fileName = filename(p) ?? "";
        if (addPrefix) {
            const dirName = pathe.dirname(p);
            map.set(p, pathe.join(dirName, fileName));
        } else {
            map.set(p, fileName);
        }
    }

    return map;
});
</script>

<style scoped></style>
