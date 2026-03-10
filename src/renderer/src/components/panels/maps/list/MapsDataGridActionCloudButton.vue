<template>
    <UTooltip :text="tooltip">
        <!--        <UPopover>-->
        <UButton :disabled="downloadPromise !== undefined || maps.length === 0" @click="handleDownloadLatest">
            <template #leading>
                <template v-if="downloadPromise !== undefined">
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
import { fileSize } from "humanize-plus";

const props = defineProps<{ mapPath: string }>();

const tcArtifactsStore = useTcArtifactsStore();

const downloadPromise = computed(() => tcArtifactsStore.activeDownloads.get(props.mapPath));

const maps = computed(() => {
    const n = filename(props.mapPath);
    if (n) {
        return tcArtifactsStore.mapsList.get(n) ?? [];
    } else {
        return [];
    }
});
const tooltip = computed(() =>
    maps.value.length > 0
        ? `Download latest (${maps.value[0].dateModified.toDateString()}) ${fileSize(maps.value[0].size)}`
        : "No artifacts available",
);

function handleDownloadLatest() {
    tcArtifactsStore.downloadMap(props.mapPath, maps.value[0].objectKey);
}
</script>

<style scoped></style>
