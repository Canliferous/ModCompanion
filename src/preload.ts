// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { Launchers } from "./shared/Launchers.js";

const { ipcRenderer, contextBridge, IpcRendererEvent } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
    app: {
        exit: () => ipcRenderer.send("app_exit"),
        launch: (launcherType: Launchers, launcherArgs: string) =>
            ipcRenderer.send("app_launch", launcherType, launcherArgs),
    },

    config: {
        get: () => ipcRenderer.invoke("config_get"),
    },

    map: {
        listSourceDirs: () => ipcRenderer.invoke("map_list_source_dirs"),
        enqueue: (mapPath: string) => ipcRenderer.send("map_enqueue", mapPath),
        subscribeQueueUpdated: (callback: (maps: string[]) => void) =>
            ipcRenderer.on("map_queue_updated", (e: typeof IpcRendererEvent, v: string[]) => callback(v)),
        // unsubscribeMapQueueUpdated: (callback) => ipcRenderer.off("map_queue_updated", (e, v) => callback(v)),
    },
});
