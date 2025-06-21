import { defineStore } from "pinia";
import { reactive } from "vue";
import { SharedImageMetaReport } from "Shared/SharedImageMetaReport.js";

export const useImageCacheStore = defineStore("image-cache", () => {
    const cache = reactive(new Map<string, SharedImageMetaReport>());

    async function getMeta(imagePath: string): Promise<SharedImageMetaReport | undefined> {
        if (cache.has(imagePath)) return cache.get(imagePath);

        const report = await window.electronAPI.image.getMeta(imagePath);
        if (report === undefined) return undefined;

        cache.set(imagePath, report);
        return report;
    }

    return { cache, getMeta };
});
