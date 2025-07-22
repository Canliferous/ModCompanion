<template>
    <div class="grid gap-1 h-full overflow-y-auto content-start">SDFSDFSD</div>
</template>

<script setup lang="ts">
import { SharedAsset, SharedAssetType, SharedTextureAsset } from "Shared/SharedAssetDefinition.js";
import { TabsItem } from "@nuxt/ui/components/Tabs.vue.js";

const props = defineProps<{ asset: SharedAsset }>();

const filesTab: TabsItem = {
    label: "Files",
    slot: "files",
};
const tabs = computed(() => {
    switch (props.asset.def.type) {
        case SharedAssetType.Texture: {
            return [
                {
                    label: "Texture",
                    slot: "texture",
                },
                filesTab,
            ];
        }

        case SharedAssetType.Unknown:
        default: {
            return [filesTab];
        }
    }
});
</script>

<style scoped></style>
