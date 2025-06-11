<template>
    <div class="grid grid-cols-[minmax(auto,_400px)_1fr] grid-rows-1 h-full gap-2">
        <div class="grid grid-rows-[auto_minmax(0,_1fr)] gap-1 h-full">
            <div class="flex gap-1">
                <UInput placeholder="Search" leading-icon="tdesign:search" class="grow" autofocus />
                <!--                <USelectMenu />-->
            </div>
            <div class="grid grid-cols-[auto_1fr] grid-rows-[auto_1fr] gap-x-2">
                <div class="grid col-span-full grid-cols-subgrid items-center bg-elevated p-2 text-xs tracking-wider">
                    <div>Hash</div>
                    <div>Asset</div>
                </div>
                <div class="grid col-span-full grid-cols-subgrid overflow-y-scroll">
                    <button
                        v-for="[hash, asset] in listStore.assets.entries()"
                        class="grid col-span-full grid-cols-subgrid p-1 items-center border-b-1 border-accented hover:bg-accented cursor-pointer text-left"
                    >
                        <span class="font-mono text-sm">{{ hash.substring(0, 5) }}</span>
                        <span>{{ asset.displayName }}</span>
                    </button>
                </div>
            </div>
        </div>
        <div>fsdfd</div>
    </div>
</template>

<script setup lang="ts">
import { useAssetListStore } from "../../store/AssetListStore.js";
import { computed } from "vue";

const listStore = useAssetListStore();
</script>

<style scoped></style>
