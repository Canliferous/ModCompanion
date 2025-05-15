import { ipcRenderer } from "electron";

export const LauncherApi = {
    launch: () => ipcRenderer.send("launch"),
};
