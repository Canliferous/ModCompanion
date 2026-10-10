import { ConfigSystem } from "../CoreConfigSystem.js";
import * as pathe from "pathe";
import fs from "fs/promises";
import crypto from "node:crypto";
import { Logger } from "../CoreLogSystem.js";
import * as Shared from "mod_companion_shared";

export const ConversionChecksumSystem = {
    checksums: new Map<Shared.Asset.AssetId, string>(),
    enabled: true,

    async initChecksums(map: Map<Shared.Asset.AssetId, Shared.Asset.Asset>) {
        if (!this.enabled) {
            Logger.info(Shared.Log.Channel.ConversionAgent, `Created no checksums because the system is disabled`);
            return;
        }

        const { millis } = await Shared.Timing.timeMillisAsync(async () => {
            const assets = map.values();
            const promises = assets.map(async (asset) => {
                if (!asset.def.contentFiles) return;

                const sum = await this.createChecksum(asset.def.contentFiles);
                this.checksums.set(asset.def.id, sum);
            });

            await Promise.allSettled(promises);
        });
        Logger.info(Shared.Log.Channel.ConversionAgent, `Initialized asset checksums in`, millis, "ms");
    },
    async createChecksum(contentFiles: string[]) {
        const contentPath = ConfigSystem.getAppConfig().contentPath;

        const promises = contentFiles.map(async (f) => {
            const p = pathe.join(contentPath, f);
            const fileContents = await fs.readFile(p, "base64");
            const hash = crypto.createHash("sha1").update(fileContents).digest("base64");
            return hash;
        });

        const results = await Promise.all(promises);
        const sum = results.join();
        return sum;
    },
    async hasChanged(asset: Shared.Asset.AssetDef): Promise<boolean> {
        if (!this.enabled) return false;
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
