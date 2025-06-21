<script setup lang="ts">
import { SharedAsset } from "Shared/SharedAsset.js";
import AssetsTabTextureSource from "~/components/pages/assets/tabs/texture/AssetsTabTextureSource.vue";

const props = defineProps<{ asset: SharedAsset }>();
</script>

<template>
    <div>
        <Suspense>
            <AssetsTabTextureSource :source-file="asset.contentFiles[0]" v-if="asset.contentFiles.length > 0" />
        </Suspense>
    </div>
</template>

<style scoped></style>
