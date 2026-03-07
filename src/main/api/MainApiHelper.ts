import { WindowSystem } from "../systems/MainWindowSystem.js";
import { isHeadless } from "../main.js";
import * as Shared from "mod_companion_shared";

export const IpcHelper = {
    send(channel: Shared.Ipc.Channel, ...args: any[]) {
        if (isHeadless()) {
            return;
        }

        const window = WindowSystem.getMainWindow();
        if (window) {
            window.webContents.send(channel, ...args);
        }
    },
};
