// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

const { ipcRenderer, contextBridge } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
    launch: (launcherType) => ipcRenderer.send("launch", launcherType),
    listMapSourceDirs: () => ipcRenderer.invoke("list_map_source_dirs"),
});
