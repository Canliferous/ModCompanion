import * as Shared from "mod_companion_shared";
import { getAppConfig } from "~/renderer-config.js";

export interface AssetDragDropTransferData {
    assetIds: Shared.Asset.AssetId[];
    groupIds: Shared.AssetGroup.GroupId[];
}

const AssetIdPrefix = "asset;";
const GroupIdPrefix = "group;";

export function deserializeAssetDragDropTransferData(transferData: string): AssetDragDropTransferData {
    const splits = transferData.split("\n");

    const assetIds: Shared.Asset.AssetId[] = [];
    const groupIds: Shared.AssetGroup.GroupId[] = [];
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
        return Shared.SourceFs.correctProjectPath(fullPath, getAppConfig().rootPath);
    }

    const plaintext = event.dataTransfer?.getData("text/plain");
    if (plaintext) {
        const lines = plaintext.split("\n");
        return lines[0];
    }

    return undefined;
}
