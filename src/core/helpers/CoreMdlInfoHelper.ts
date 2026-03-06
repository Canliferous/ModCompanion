import child_process from "node:child_process";
import { KvSerializer, parseText } from "@sourcelib/kv";
import { getAppConfig } from "../systems/CoreConfigSystem.js";
import * as Shared from "mod_companion_shared";

export const MdlInfoHelper = {
    async run(mdlFilePath: string): Promise<Shared.MdlInfo.SharedMdlInfoReport> {
        return new Promise((resolve, reject) => {
            const cmd = `${getAppConfig().mdlInfoPath} -game ${getAppConfig().gamePath} ${mdlFilePath}`;

            const output: string[] = [];

            const proc = child_process.spawn(cmd, { shell: true });

            proc.stdout.on("data", (d) => output.push(d.toString()));

            proc.on("exit", (code: number) => {
                if (code === 0) {
                    const kvFile = output.join("\n");
                    const result = KvSerializer.deserialize(parseText(kvFile), { detectArrays: true });
                    if (result.length !== 1) {
                        reject();
                    }

                    resolve(result[0] as unknown as Shared.MdlInfo.SharedMdlInfoReport);
                }
            });
        });
    },
};
