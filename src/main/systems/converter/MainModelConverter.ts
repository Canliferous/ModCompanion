import { SharedModelAssetDefinition } from "Shared/SharedAssetDefinition.js";
import { getAppConfig } from "../MainConfigSystem.js";
import path from "path";
import { runConverter } from "./MainSharedConverter.js";

export const ModelConverter = {
    getQcFile(asset: SharedModelAssetDefinition): string | undefined {
        const qcFile = asset.contentFiles?.find((f) => f.endsWith(".qc"));
        return qcFile;
    },
    async convert(asset: SharedModelAssetDefinition): Promise<string | undefined> {
        const qcFile = this.getQcFile(asset);
        if (!qcFile) return undefined;
        const fullQcFile = path.join(getAppConfig().contentPath, qcFile);

        console.log(`Converting model ${fullQcFile}`);
        return this.createMdl(fullQcFile);
    },
    async createMdl(qcPath: string): Promise<string> {
        const config = getAppConfig();
        const cmd = `${config.studioMdlPath} -game ${config.gamePath} ${qcPath}`;

        return runConverter(cmd, config.gamePath, "StudioMDL");
    },
};
