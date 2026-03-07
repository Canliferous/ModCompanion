import { ConfigSystem } from "../CoreConfigSystem.js";
import path from "path";
import fs from "fs/promises";
import crypto from "node:crypto";
import { Logger } from "../CoreLogSystem.js";
import * as Shared from "mod_companion_shared";

export const ConversionChecksumSystem = {
    checksums: new Map<Shared.Asset.AssetId, string>(),
    async initChecksums(map: Shared.Asset.SharedAssetMap) {
        const startTime = new Date();
        {
            const assets = map.values();
            const promises = assets.map(async (asset) => {
                if (!asset.def.contentFiles) return;

                const sum = await this.createChecksum(asset.def.contentFiles);
                this.checksums.set(asset.def.id, sum);
            });

            await Promise.allSettled(promises);
        }
        const endTime = new Date();
        Logger.info(
            Shared.Log.Channel.ConversionAgent,
            `Initialized asset checksums in ${endTime.getTime() - startTime.getTime()}ms`,
        );
    },
    async createChecksum(contentFiles: string[]) {
        const contentPath = ConfigSystem.getAppConfig().contentPath;

        const promises = contentFiles.map(async (f) => {
            const p = path.join(contentPath, f);
            const fileContents = await fs.readFile(p, "base64");
            const hash = crypto.createHash("sha1").update(fileContents).digest("base64");
            return hash;
        });

        const results = await Promise.all(promises);
        const sum = results.join();
        return sum;
    },
    async hasChanged(asset: Shared.Asset.SharedAssetDefinition): Promise<boolean> {
        if (asset.contentFiles === undefined || asset.contentFiles.length === 0) return false;

        const newSum = await this.createChecksum(asset.contentFiles);
        const oldSum = this.checksums.get(asset.id);

        if (newSum !== oldSum) {
            this.checksums.set(asset.id, newSum);
            return true;
        } else {
            return false;
        }
    },
};
