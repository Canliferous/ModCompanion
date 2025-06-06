<template>
    <div v-show="drawerStore.isOpen" class="w-80 bg-success/10 border-success-800 border-1 overflow-y-auto">
        <UTree
            :items="drawerStore.drawerTree"
            color="success"
            :ui="{
                listWithChildren: 'border-success-800',
                itemWithChildren: 'p-0',
                link: 'border-b-1 border-success-800',
            }"
        >
            <template #item-trailing="{ item }">
                <div v-if="isMapTreeItem(item)">
                    <UButton
                        :class="{ invisible: listStore.isMapAdded(item.vmfPath) }"
                        icon="tdesign:arrow-right"
                        variant="ghost"
                        @click="listStore.addMap(item.vmfPath)"
                        color="success"
                    />
                </div>
            </template>
        </UTree>
    </div>
</template>

<script setup lang="ts">
import { useMapDrawerStore } from "../../../store/MapDrawerStore.js";
import { isMapTreeItem } from "../../../model/MapTreeItem.js";
import { useMapListStore } from "../../../store/MapListStore.js";

const drawerStore = useMapDrawerStore();
const listStore = useMapListStore();
</script>

<style scoped></style>
