import { WindowSystem } from "../systems/MainWindowSystem.js";
import * as Shared from "mod_companion_shared";

export const IpcHelper = {
    send(channel: Shared.Ipc.Channel, ...args: any[]) {
        const window = WindowSystem.getMainWindow();
        if (window) {
            window.webContents.send(channel, ...args);
        }
    },
};
