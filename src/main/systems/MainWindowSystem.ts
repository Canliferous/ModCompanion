import { app, BrowserWindow, globalShortcut, Menu, Rectangle, Tray } from "electron";
import path from "node:path";
import settings from "electron-settings";
import { getMainAssetsDir, getRendererDir, getRootDir } from "../helpers/MainFilesystem.js";

const SETTING_WINDOW_BOUNDS = "window.bounds";
const SETTING_WINDOW_MAXIMIZED = "window.maximized";

let mainWindow: BrowserWindow | undefined;
let tray: Tray | undefined;
let preventClose = true;

export function getMainWindow(): BrowserWindow | undefined {
    return mainWindow;
}

export function initWindowSystem(): boolean {
    app.on("activate", () => {
        // On OS X it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) {
            _createWindow();
        }
    });

    app.whenReady().then(_handleReady);

    return true;
}

export function disablePreventClose(): void {
    preventClose = false;
}

function _handleReady(): void {
    _createTray();
    _createWindow();
    _createGlobalShortcuts();
}

interface WindowRect {
    x?: number;
    y?: number;
    width: number;
    height: number;
}
function _getSettingsBounds(): WindowRect {
    const defaultBounds: WindowRect = { width: 1400, height: 800 };
    const bounds = (settings.getSync(SETTING_WINDOW_BOUNDS) as Partial<Rectangle>) ?? defaultBounds;

    bounds.width ??= defaultBounds.width;
    bounds.height ??= defaultBounds.height;

    return bounds as WindowRect;
}

function _createWindow(): void {
    const bounds = _getSettingsBounds();
    mainWindow = new BrowserWindow({
        width: bounds.width,
        height: bounds.height,
        x: bounds.x,
        y: bounds.y,
        webPreferences: {
            preload: path.join(getRootDir(), "preload.js"),
            contextIsolation: true,
            nodeIntegration: false,
            webSecurity: false,
        },
        icon: path.join(getMainAssetsDir(), "mod_companion_192.png"),
    });

    // Event listeners

    mainWindow.on("close", (event) => {
        if (preventClose) {
            event.preventDefault();
            mainWindow?.hide();
        }
    });

    app.on("before-quit", (event) => {
        const bounds = mainWindow?.getBounds();
        if (bounds) {
            settings.setSync(SETTING_WINDOW_BOUNDS, bounds as any);
        }
    });

    mainWindow.on("maximize", () => settings.set(SETTING_WINDOW_MAXIMIZED, true));
    mainWindow.on("unmaximize", () => settings.set(SETTING_WINDOW_MAXIMIZED, false));

    // Open the window

    if (process.env.NODE_ENV === "development") {
        mainWindow.loadURL("http://localhost:5173");
        mainWindow.webContents.openDevTools();
    } else {
        mainWindow.loadFile(path.join(getRendererDir(), `index.html`));
    }

    mainWindow.removeMenu();

    if (settings.getSync(SETTING_WINDOW_MAXIMIZED)) {
        mainWindow.maximize();
    }
}

function _createTray(): void {
    tray = new Tray(path.join(getMainAssetsDir(), "mod_companion_192.png"));

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
function _createGlobalShortcuts() {
    globalShortcut.register("Control+=", () => _changeZoom(0.1));
    globalShortcut.register("Control+-", () => _changeZoom(-0.1));
    globalShortcut.register("Control+0", () => _resetZoom());
    globalShortcut.register("Control+num0", () => _resetZoom());
    globalShortcut.register("Control+numadd", () => _changeZoom(0.1));
    globalShortcut.register("Control+numsub", () => _changeZoom(-0.1));

    mainWindow?.webContents.on("before-input-event", (event, input) => {
        if (input.key.toLowerCase() === "f12") {
            event.preventDefault();
            mainWindow?.webContents.toggleDevTools();
        }
    });
}

function _changeZoom(delta: number) {
    console.log("Change zoom", delta);
    zoomFactor = Math.max(0.1, zoomFactor + delta);
    mainWindow?.webContents.setZoomFactor(zoomFactor);
}

function _resetZoom() {
    zoomFactor = 1.0;
    mainWindow?.webContents.setZoomFactor(zoomFactor);
}
