<template>
    <UTooltip :text="maps ? 'Download latest from Cloud' : 'No artifacts available'">
        <!--        <UPopover>-->
        <UButton :disabled="downloadPromise || !maps" @click="handleDownload">
            <template #leading>
                <template v-if="downloadPromise">
                    <UIcon :name="AppDesign.Icons.Loading" class="size-5 animate-spin" />
                </template>
                <template v-else>
                    <UIcon :name="AppDesign.Icons.ActionDownload" class="size-5" />
                </template>
            </template>
        </UButton>
        <!--            <template #content>-->
        <!--                <div class="p-2 grid grid-cols-[1fr_auto_auto] gap-2">-->
        <!--                    <div-->
        <!--                        v-for="map in maps"-->
        <!--                        :key="map.dateModified.getTime()"-->
        <!--                        class="grid grid-cols-subgrid col-span-full items-center"-->
        <!--                    >-->
        <!--                        <span class="select-none tabular-nums">-->
        <!--                            {{ map.dateModified.toDateString() }}-->
        <!--                        </span>-->
        <!--                        <span class="select-none tabular-nums text-right">-->
        <!--                            {{ fileSize(map.size) }}-->
        <!--                        </span>-->
        <!--                        <UButton-->
        <!--                            size="sm"-->
        <!--                            variant="ghost"-->
        <!--                            :icon="AppDesign.Icons.ActionDownload"-->
        <!--                            @click="handleDownload"-->
        <!--                        />-->
        <!--                    </div>-->
        <!--                </div>-->
        <!--            </template>-->
        <!--        </UPopover>-->
    </UTooltip>
</template>

<script setup lang="ts">
import { AppDesign } from "~/design/AppDesign.js";
import { useTcArtifactsStore } from "~/store/TcArtifactsStore.js";
import { filename } from "pathe/utils";

const props = defineProps<{ mapPath: string }>();

const tcArtifactsStore = useTcArtifactsStore();

const downloadPromise = ref<Promise<boolean> | undefined>(undefined);

const maps = computed(() => {
    const n = filename(props.mapPath);
    if (n) {
        return tcArtifactsStore.mapsList.get(n) ?? [];
    } else {
        return [];
    }
});

function handleDownload() {
    downloadPromise.value = tcArtifactsStore
        .downloadMap(props.mapPath, maps.value[0].objectKey)
        .finally(() => (downloadPromise.value = undefined));
}
</script>

<style scoped></style>
