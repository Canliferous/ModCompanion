import child_process from "node:child_process";
import { ConfigSystem } from "../systems/CoreConfigSystem.js";
import os from "node:os";

export function runProcess(cmd: string, processName = "Process"): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        try {
            const data: string[] = [];
            const proc = child_process.exec(
                cmd,
                { cwd: ConfigSystem.getAppConfig().gamePath },
                (error, stdout, stderr) => {
                    if (stdout) {
                        data.push(stdout.toString());
                    } else if (error) {
                        reject(`${processName} failed: ${error.message}`);
                    } else if (stderr) {
                        reject(`${processName} failed: ${stderr}`);
                    }
                },
            );
            if (proc.pid !== undefined) {
                os.setPriority(proc.pid, os.constants.priority.PRIORITY_LOW);
            }
            proc.on("close", (code) => {
                if (code === 0 || code === null) {
                    resolve(data.join("\n"));
                } else {
                    reject();
                }
            });
            proc.on("error", (e) => {
                reject(e);
            });
        } catch (e) {
            if (typeof e === "string") {
                reject(e);
            } else {
                reject(`${processName} info exited with unknown error`);
            }
        }
    });
}
