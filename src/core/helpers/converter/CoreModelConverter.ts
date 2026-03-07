import path from "path";
import { runConverter } from "./CoreSharedConverter.js";
import { Logger } from "../../systems/CoreLogSystem.js";
import * as Shared from "mod_companion_shared";
import { ConfigSystem } from "../../systems/CoreConfigSystem.js";

export const ModelConverter = {
    getQcFile(asset: Shared.Asset.SharedModelAssetDefinition): string | undefined {
        const qcFile = asset.contentFiles?.find((f) => f.endsWith(".qc"));
        return qcFile;
    },
    async convert(asset: Shared.Asset.SharedModelAssetDefinition): Promise<string | undefined> {
        const qcFile = this.getQcFile(asset);
        if (!qcFile) return undefined;
        const fullQcFile = path.join(ConfigSystem.getAppConfig().contentPath, qcFile);

        Logger.info(Shared.Log.Channel.ConversionAgent, `Converting model ${fullQcFile}`);
        return this.createMdl(fullQcFile);
    },
    async createMdl(qcPath: string): Promise<string> {
        const config = ConfigSystem.getAppConfig();
        const cmd = `${config.studioMdlPath} -game ${config.gamePath} ${qcPath}`;

        return runConverter(cmd, config.gamePath, "StudioMDL");
    },
};
