import { app, BrowserWindow, globalShortcut, Menu, Rectangle, Tray } from "electron";
import path from "node:path";
import { fileURLToPath } from "node:url";
import settings from "electron-settings";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const rendererRoot = path.join(dirname, "../../renderer/");
const mainAssetsRoot = path.join(dirname, "../../main_assets/");

let mainWindow: BrowserWindow | undefined;
let tray: Tray | undefined;

export function getMainWindow(): BrowserWindow | undefined {
    return mainWindow;
}

export function initWindowSystem(): boolean {
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
    mainWindow = new BrowserWindow({
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

    mainWindow.on("close", (event) => {
        event.preventDefault();
        mainWindow?.hide();
    });

    if (process.env.NODE_ENV === "development") {
        mainWindow.loadURL("http://localhost:5173");
        mainWindow.webContents.openDevTools();
    } else {
        mainWindow.loadFile(path.join(rendererRoot, `index.html`));
    }

    mainWindow.removeMenu();

    if (settings.getSync("window.maximized")) {
        mainWindow.maximize();
    }

    mainWindow.on("maximize", () => settings.set("window.maximized", true));
    mainWindow.on("unmaximize", () => settings.set("window.maximized", false));

    // TODO: This doesnt work
    mainWindow.on("close", (event) => {
        const bounds = mainWindow?.getBounds();
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
            { label: "Show", click: () => mainWindow?.show() },
            { label: "Quit", click: () => app.exit() },
        ]),
    );

    tray.on("click", (event) => {
        mainWindow?.show();
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

    // if (process.env.NODE_ENV !== "development") {
    mainWindow?.webContents.on("before-input-event", (event, input) => {
        if (input.key.toLowerCase() === "f12") {
            event.preventDefault();
            mainWindow?.webContents.toggleDevTools();
        }
    });
    // }
}

function changeZoom(delta: number) {
    console.log("Change zoom", delta);
    zoomFactor = Math.max(0.1, zoomFactor + delta);
    mainWindow?.webContents.setZoomFactor(zoomFactor);
}

function resetZoom() {
    zoomFactor = 1.0;
    mainWindow?.webContents.setZoomFactor(zoomFactor);
}
