import pathe from "pathe";
import { filename } from "pathe/utils";

// The intent is to not show the map's folder "prefix" if all maps share are in the same folder.
// Only show it when they're in different folders
export function useMapDisplayNames(list: string[]) {
    let prefix: string | undefined = undefined;
    let addPrefix = false;

    for (const p of list) {
        const dirName = pathe.dirname(p);
        if (prefix === undefined) {
            prefix = dirName;
        } else if (prefix !== dirName) {
            addPrefix = true;
            break;
        }
    }

    const map = new Map<string, string>();
    for (const p of list) {
        const fileName = filename(p) ?? "";
        if (addPrefix) {
            const dirName = pathe.dirname(p);
            map.set(p, pathe.join(dirName, fileName));
        } else {
            map.set(p, fileName);
        }
    }

    return map;
}
