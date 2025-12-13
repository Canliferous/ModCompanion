import { WindowSystem } from "../systems/MainWindowSystem.js";
import { SharedIpcChannel } from "Shared/SharedIpcChannels.js";
import { isHeadless } from "../main.js";

export const IpcHelper = {
    send(channel: SharedIpcChannel, ...args: any[]) {
        if (isHeadless()) {
            return;
        }

        const window = WindowSystem.getMainWindow();
        if (!window) {
            console.error("Failed to send through ipc. Main window doesn't exist!");
            return;
        }
        window.webContents.send(channel, ...args);
    },
};
