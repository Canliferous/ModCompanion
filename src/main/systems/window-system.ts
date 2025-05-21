import { app, BrowserWindow, Tray, Event, Menu } from "electron";
import path from "node:path";
import { fileURLToPath } from "url";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const rendererRoot = path.join(dirname, "../../renderer/");
const mainAssetsRoot = path.join(dirname, "../../main_assets/");

let window: BrowserWindow | undefined;
let tray: Tray | undefined;

export function initWindowSystem(): boolean {
    // app.on("window-all-closed", (event) => {
    //     event.preventDefault();
    // });

    app.on("activate", () => {
        // On OS X it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });

    app.whenReady().then(handleReady);

    return true;
}

function handleReady(): void {
    createTray();
    createWindow();
}

function createWindow(): void {
    window = new BrowserWindow({
        width: 1400,
        height: 800,
        webPreferences: {
            preload: path.join(dirname, "../..", "preload.js"),
            contextIsolation: true,
            nodeIntegration: false,
        },
        icon: path.join(mainAssetsRoot, "mod_companion_192.png"),
    });

    window.on("close", (event) => {
        event.preventDefault();
        window?.hide();
    });

    if (process.env.NODE_ENV === "development") {
        window.loadURL("http://localhost:5173");
    } else {
        window.loadFile(path.join(rendererRoot, `index.html`));
    }

    window.removeMenu();
    window.maximize();
}

function createTray(): void {
    tray = new Tray(path.join(mainAssetsRoot, "mod_companion_192.png"));

    tray.setToolTip("Mod Companion");
    tray.setContextMenu(
        Menu.buildFromTemplate([
            { label: "Show", click: () => window?.show() },
            { label: "Quit", click: () => app.exit() },
        ]),
    );

    tray.on("click", (event) => {
        window?.show();
    });
}
