import { WindowSystem } from "../systems/MainWindowSystem.js";
import { SharedIpcChannel } from "Shared/SharedIpcChannels.js";
import { isHeadless } from "../main.js";

export const IpcHelper = {
    send(channel: SharedIpcChannel, ...args: any[]) {
        if (isHeadless()) {
            return;
        }

        const window = WindowSystem.getMainWindow();
        if (window) {
            window.webContents.send(channel, ...args);
        }
    },
};
