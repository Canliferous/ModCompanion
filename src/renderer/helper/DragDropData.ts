import { SharedAssetId } from "Shared/SharedAssetDefinition.js";
import { SharedAssetGroupId } from "Shared/SharedAssetGroup.js";

export interface AssetDragDropTransferData {
    assetIds: SharedAssetId[];
    groupIds: SharedAssetGroupId[];
}

const AssetIdPrefix = "asset;";
const GroupIdPrefix = "group;";

export function deserializeAssetDragDropTransferData(transferData: string) {
    const splits = transferData.split("\n");

    const assetIds: SharedAssetId[] = [];
    const groupIds: SharedAssetGroupId[] = [];
    for (const split of splits) {
        if (split.startsWith(AssetIdPrefix)) {
            const id = split.substring(AssetIdPrefix.length);
            assetIds.push(id);
        }

        if (split.startsWith(GroupIdPrefix)) {
            const id = split.substring(GroupIdPrefix.length);
            groupIds.push(id);
        }
    }

    return { assetIds, groupIds };
}

export async function handleDrop(files: File[] | null, event: DragEvent) {
    if (files !== null && files.length === 1) {
        const fullPath = window.electronAPI.webUtils.getPathForFile(files[0]);
        const correctPath = await window.electronAPI.project.correctPath(fullPath);
        return correctPath;
    }

    const plaintext = event.dataTransfer?.getData("text/plain");
    if (plaintext) {
        const lines = plaintext.split("\n");
        return lines[0];
    }

    return undefined;
}
