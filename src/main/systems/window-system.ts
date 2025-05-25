import { app, BrowserWindow, Tray, Event, Menu, globalShortcut, Rectangle } from "electron";
import path from "node:path";
import { fileURLToPath } from "url";
import settings from "electron-settings";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const rendererRoot = path.join(dirname, "../../renderer/");
const mainAssetsRoot = path.join(dirname, "../../main_assets/");

let window: BrowserWindow | undefined;
let tray: Tray | undefined;

export function getMainWindow(): BrowserWindow | undefined {
    return window;
}

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
    createGlobalShortcuts();
}

interface WindowRect {
    x?: number;
    y?: number;
    width: number;
    height: number;
}
function getSettingsBounds(): WindowRect {
    const defaultBounds: WindowRect = { width: 1400, height: 800 };
    const bounds = (settings.getSync("settings.bounds") as Partial<Rectangle>) ?? defaultBounds;

    bounds.width ??= defaultBounds.width;
    bounds.height ??= defaultBounds.height;

    return bounds as WindowRect;
}

function createWindow(): void {
    const bounds = getSettingsBounds();
    window = new BrowserWindow({
        width: bounds.width,
        height: bounds.height,
        x: bounds.x,
        y: bounds.y,
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
        window.webContents.openDevTools();
    } else {
        window.loadFile(path.join(rendererRoot, `index.html`));
    }

    window.removeMenu();

    if (settings.getSync("window.maximized")) {
        window.maximize();
    }

    window.on("maximize", () => settings.set("window.maximized", true));
    window.on("unmaximize", () => settings.set("window.maximized", false));

    window.on("close", (event) => {
        console.log(window);
        const bounds = window?.getBounds();
        console.log(bounds);
        if (bounds) {
            settings.setSync("window.bounds", bounds as any);
        }
    });
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

let zoomFactor = 1;
function createGlobalShortcuts() {
    globalShortcut.register("Control+=", () => changeZoom(0.1));
    globalShortcut.register("Control+-", () => changeZoom(-0.1));
    globalShortcut.register("Control+0", () => resetZoom());
    globalShortcut.register("Control+num0", () => resetZoom());
    globalShortcut.register("Control+numadd", () => changeZoom(0.1));
    globalShortcut.register("Control+numsub", () => changeZoom(-0.1));
}

function changeZoom(delta: number) {
    zoomFactor = Math.max(0.1, zoomFactor + delta);
    window?.webContents.setZoomFactor(zoomFactor);
}

function resetZoom() {
    zoomFactor = 1.0;
    window?.webContents.setZoomFactor(zoomFactor);
}
