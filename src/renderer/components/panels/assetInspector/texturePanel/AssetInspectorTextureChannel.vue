<script setup lang="ts">
import { useTextureViewOptionsStore } from "~/store/TextureViewOptionsStore.js";
import { base64ImageUrl } from "~/helper/ImageHelper.js";

const optionsStore = useTextureViewOptionsStore();

const props = defineProps<{ labelName: string; data: string | undefined }>();
</script>

<template>
    <div class="relative" v-show="data !== undefined">
        <div :class="`absolute top-0 left-0 w-5 text-center`" v-if="optionsStore.showChannels">
            {{ labelName }}
        </div>
        <img v-if="data" :src="base64ImageUrl(data)" alt="" class="max-h-full" />
    </div>
</template>

<style scoped></style>
