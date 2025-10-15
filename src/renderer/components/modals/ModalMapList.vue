<template>
    <UModal title="Add Maps" :close="true">
        <template #body>
            <div>
                <UTree :items="drawerStore.drawerTree">
                    <template #item-trailing="{ item }">
                        <div v-if="isMapTreeItem(item)">
                            <UButton
                                :class="{ invisible: listStore.isMapAdded(item.vmfPath) }"
                                icon="lucide:arrow-right"
                                variant="ghost"
                                @click="listStore.addMap(item.vmfPath)"
                            />
                        </div>
                    </template>
                </UTree>
            </div>
        </template>
        <template #default>
            <slot />
        </template>
    </UModal>
</template>

<script setup lang="ts">
import { useMapDrawerStore } from "~/store/MapDrawerStore.js";
import { useMapListStore } from "~/store/MapListStore.js";
import { isMapTreeItem } from "~/model/MapTreeItem.js";

const drawerStore = useMapDrawerStore();
const listStore = useMapListStore();
</script>

<style scoped></style>
