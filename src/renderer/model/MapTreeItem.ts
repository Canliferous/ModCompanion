import { TreeItem } from "@nuxt/ui/components/Tree.vue.js";

export interface MapTreeItem extends TreeItem {
    // Relative to map source dir
    vmfPath: string;
}

export function isMapTreeItem(item: TreeItem): item is MapTreeItem {
    return (item as any).vmfPath !== undefined;
}
