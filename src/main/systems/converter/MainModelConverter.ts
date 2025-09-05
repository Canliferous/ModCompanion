import { SharedModelAssetDefinition } from "Shared/SharedAssetDefinition.js";
import * as child_process from "node:child_process";
import { getConfig } from "../MainConfigSystem.js";
import { AssetState, AssetStates } from "../MainConversionAgentSystem.js";
import path from "path";

export async function convertModelAsset(asset: SharedModelAssetDefinition): Promise<string | undefined> {
    const qcFile = asset.contentFiles?.find((f) => f.endsWith(".qc"));
    if (!qcFile) return undefined;

    const fullQcFile = path.join(getConfig().contentPath, qcFile);

    console.log(`Converting model ${fullQcFile}`);
    return createMdl(fullQcFile);
}

export async function determineModelAssetState(asset: SharedModelAssetDefinition): Promise<AssetState> {
    const qcFile = asset.contentFiles?.find((f) => f.endsWith(".qc"));
    if (!qcFile) return AssetStates.Invalid;

    // TODO: Read mdl files
    return AssetStates.HasOutputFiles; // Returning this for now so conversion agent doesn't trigger a conversion automatically
}

export async function createMdl(qcPath: string): Promise<string> {
    const config = getConfig();
    const cmd = `${config.studioMdlPath} -game ${config.gamePath} ${qcPath}`;
    console.log("Creating mdl. cmd:", cmd);

    let log: string[] = [];

    return new Promise((resolve, reject) => {
        const proc = child_process.exec(cmd, { cwd: config.gamePath });
        proc.stdout?.on("data", (d) => {
            log.push(d);
        });
        proc.on("exit", (code) => {
            resolve(log.join());
        });
    });
}
