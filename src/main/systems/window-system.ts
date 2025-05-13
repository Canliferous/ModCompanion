import { app, BrowserWindow } from "electron";
import path from "node:path";

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 1400,
        height: 800,
        webPreferences: {
            // preload: path.join(__dirname, 'preload.js'),
        },
    });

    if (process.env.NODE_ENV === "development") {
        mainWindow.loadURL("http://localhost:5173");
        mainWindow.webContents.openDevTools();
    } else {
        mainWindow.loadFile(path.join(__dirname, `renderer/index.html`));
    }

    mainWindow.webContents.openDevTools();
}

export function initWindowSystem(): boolean {
    app.on("window-all-closed", () => {
        if (process.platform !== "darwin") {
            app.quit();
        }
    });

    app.on("activate", () => {
        // On OS X it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });

    if (app.isReady()) {
        createWindow();
    } else {
        app.on("ready", createWindow);
    }

    return true;
}
