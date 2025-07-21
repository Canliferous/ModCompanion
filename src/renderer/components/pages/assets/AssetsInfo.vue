<template>
    <div class="grid gap-1 h-full overflow-y-auto content-start">
        <AssetsGeneralEdit :asset="asset" />
        <UTabs :items="tabs" variant="link" size="xs" color="neutral">
            <template #files>
                <AssetsTabFiles :asset="asset" />
            </template>
            <template #texture>
                <AssetsTabTexture :asset="asset as SharedTextureAsset" />
            </template>
        </UTabs>
    </div>
</template>

<script setup lang="ts">
import { SharedAsset, SharedAssetType, SharedTextureAsset } from "Shared/SharedAssetDefinition.js";
import { TabsItem } from "@nuxt/ui/components/Tabs.vue.js";
import AssetsGeneralEdit from "~/components/pages/assets/edit/AssetsGeneralEdit.vue";

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
