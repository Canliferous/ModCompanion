import { useRemember } from "../composables/useRemember.js";
import { ref } from "vue";
import { defineStore } from "pinia";
import { TreeItem } from "@nuxt/ui/components/Tree.vue.js";
import { filename } from "pathe/utils";
import pathe from "pathe";
import { MapTreeItem } from "../model/MapTreeItem.js";

export const useMapDrawerStore = defineStore("map-drawer", () => {
    const isOpen = useRemember(ref(false), "map-drawer-open");

    function toggleOpen() {
        isOpen.value = !isOpen.value;
    }

    const drawerTree = ref<any[]>([]);
    async function loadDrawerTree() {
        const mapDirs = await window.electronAPI.map.listSourceDirs();
        drawerTree.value = mapDirs.map<TreeItem>((d) => ({
            label: d.dirName,
            children: d.vmfNames.map<MapTreeItem>((m) => ({
                label: filename(m),
                vmfPath: pathe.join(d.dirName, m),
            })),
        }));
    }
    loadDrawerTree();

    return { isOpen, drawerTree, toggleOpen };
});
