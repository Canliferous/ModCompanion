import child_process from "node:child_process";
import os from "node:os";
import { Logger } from "../../systems/CoreLogSystem.js";
import * as Shared from "mod_companion_shared";

export async function runConverter(cmd: string, cwd: string, converterName: string): Promise<string> {
    Logger.info(Shared.Log.Channel.ConversionAgent, `Running ${converterName} converter cmd`, cmd);

    const log: string[] = [`Command: ${cmd}`, ""];

    return new Promise((resolve, reject) => {
        try {
            const proc = child_process.spawn(cmd, { shell: true, cwd });
            proc.stdout?.on("data", (d) => {
                log.push(d);
            });
            proc.stderr?.on("data", (d) => {
                log.push(d);
            });
            if (proc.pid !== undefined) {
                os.setPriority(proc.pid, os.constants.priority.PRIORITY_LOW);
            }
            proc.on("exit", (code) => {
                if (code === 0) {
                    resolve(log.join("\n"));
                } else {
                    log.push(`${converterName} Converter exited with error code ${code}`);
                    reject(log.join("\n"));
                }
            });
        } catch (e) {
            if (typeof e === "string") {
                reject(e);
            } else {
                reject("Converter exited with unknown error");
            }
        }
    });
}
