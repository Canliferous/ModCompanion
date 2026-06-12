import { filename } from "pathe/utils";
import { forwardSlashed } from "./SharedSourceFs.js";
import { getCommonPrefix, removeTrailing } from "./SharedString.js";

export interface VmtFile {
    // Root relative
    filePath: string;
    contents: Record<string, any>;
}

export function createAutoMaterial(vtfs: string[]): VmtFile | undefined {
    const vtfNames = vtfs.map((v) => filename(v)!);

    const baseTexture = vtfNames.find(isMaybeBaseTexture);
    const normalMap = vtfNames.find(isMaybeNormalMap);
    const mraoMap = vtfNames.find(isMaybeMraoMap);

    const isProbablyModelMaterial = isMaybeModelMaterial(vtfs);
    const isProbablyPbr = baseTexture && normalMap && mraoMap;
    const isProbablyLightmappedGeneric = baseTexture && isProbablyModelMaterial;
    const isProbablyVertexlitGeneric = baseTexture && !isProbablyModelMaterial;

    const filePath = guessMaterialPath(vtfs);

    if (isProbablyPbr) {
        const pbrMaterial = {
            $basetexture: baseTexture,
            $bumpmap: normalMap,
            $mraotexture: mraoMap,
            $model: isProbablyModelMaterial ? 1 : 0,
        };
        return { filePath, contents: pbrMaterial };
    } else if (isProbablyLightmappedGeneric) {
        const lightmappedMaterial = {
            $basetexture: baseTexture,
            ...(normalMap ? { $bumpmap: normalMap } : {}),
        };
        return { filePath, contents: lightmappedMaterial };
    } else if (isProbablyVertexlitGeneric) {
        const vertexlitMaterial = {
            $basetexture: baseTexture,
            ...(normalMap ? { $bumpmap: normalMap } : {}),
        };
        return { filePath, contents: vertexlitMaterial };
    }

    return undefined;
}

export function guessMaterialPath(vtfs: string[]): string {
    const commonPrefix = removeTrailing(getCommonPrefix(vtfs), "_");
    return commonPrefix;
}

export function isMaybeModelMaterial(fullVtfPaths: string[]): boolean {
    let couldBeModelScore = 0;
    for (const fullVtfPath of fullVtfPaths) {
        const splits = forwardSlashed(fullVtfPath).split("/");

        if (splits.includes("model") || splits.includes("models")) {
            couldBeModelScore++;
        }
    }

    const isProbablyModelMaterial = couldBeModelScore > fullVtfPaths.length / 2;
    return isProbablyModelMaterial;
}

export function isMaybeBaseTexture(fileNameWithoutExt: string) {
    if (fileNameWithoutExt.endsWith("_basetexture")) return true;
    if (fileNameWithoutExt.endsWith("_base")) return true;
    if (fileNameWithoutExt.endsWith("_color")) return true;
    if (fileNameWithoutExt.endsWith("_colour")) return true;
    if (fileNameWithoutExt.endsWith("_basecolor")) return true;
    if (fileNameWithoutExt.endsWith("_basecolour")) return true;
    return false;
}

export function isMaybeNormalMap(fileNameWithoutExt: string) {
    if (fileNameWithoutExt.endsWith("_normal")) return true;
    if (fileNameWithoutExt.endsWith("_bump")) return true;
    if (fileNameWithoutExt.endsWith("_n")) return true;
    return false;
}

export function isMaybeMraoMap(fileNameWithoutExit: string) {
    if (fileNameWithoutExit.endsWith("_mrao")) return true;
    if (fileNameWithoutExit.endsWith("_mrao_tintmask")) return true;
    return false;
}
