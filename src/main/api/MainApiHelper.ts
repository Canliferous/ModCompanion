import { WindowSystem } from "../systems/MainWindowSystem.js";
import * as Shared from "mod_companion_shared";
import * as Core from "mod_companion_core";

let rendererReady = false;

const preReadyMessages = new Map<Shared.Ipc.Channel, any[][]>();
export const IpcHelper = {
    send(channel: Shared.Ipc.Channel, ...args: any[]) {
        if (!rendererReady) {
            if (preReadyMessages.has(channel)) {
                preReadyMessages.get(channel)!.push(args);
            } else {
                preReadyMessages.set(channel, [args]);
            }

            return;
        }

        const window = WindowSystem.getMainWindow();
        if (window) {
            window.webContents.send(channel, ...args);
        }
    },
    markRendererReady() {
        rendererReady = true;

        Core.Logger.info(Shared.Log.Channel.Generic, "Replaying pre-ready ipc messages");
        let total = 0;
        for (const [channel, messages] of preReadyMessages.entries()) {
            for (const message of messages) {
                IpcHelper.send(channel, ...message);
                total++;
            }
        }
        Core.Logger.info(Shared.Log.Channel.Generic, "Replayed", total, "pre-ready ipc messages");
    },
};
