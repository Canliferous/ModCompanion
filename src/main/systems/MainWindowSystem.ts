import { app, BrowserWindow, Menu, Rectangle, Tray } from "electron";
import path from "node:path";
import settings from "electron-settings";
import { getMainAssetsDir, getRendererDir, getRootDir } from "../helpers/MainFilesystem.js";
import fs from "node:fs";
import { runLauncher } from "../api/MainLauncherApi.js";
import { SharedLauncherOptions } from "Shared/SharedLaunchers.js";
import { SharedLogChannel } from "Shared/SharedLogger.js";
import { Logger } from "./MainLogSystem.js";

const SETTING_WINDOW_BOUNDS = "window.bounds";
const SETTING_WINDOW_MAXIMIZED = "window.maximized";

let mainWindow: BrowserWindow | undefined;
let tray: Tray | undefined;
let preventClose = true;

export const WindowSystem = {
    getMainWindow(): BrowserWindow | undefined {
        return mainWindow;
    },
    async initSystem(): Promise<boolean> {
        await app.whenReady();
        // If needed, add a way to start the app without tray
        const noTray = false;
        const hasTray = noTray || _createTray();
        _createWindow(noTray ? false : hasTray);
        _createShortcuts();
        return true;
    },
    disablePreventClose(): void {
        preventClose = false;
    },
};

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

function _getAppIconPath() {
    return path.join(getMainAssetsDir(), "mod_companion_192.png");
}

function _createWindow(hasTray: boolean): void {
    const bounds = _getSettingsBounds();
    const iconPath = _getAppIconPath();

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
        icon: fs.existsSync(iconPath) ? iconPath : undefined,
    });

    // Event listeners

    mainWindow.on("close", (event) => {
        if (preventClose) {
            event.preventDefault();
            mainWindow?.hide();
        } else {
            const bounds = mainWindow?.getBounds();
            if (bounds) {
                settings.setSync(SETTING_WINDOW_BOUNDS, bounds as any);
            }
        }
    });

    if (hasTray) {
        app.on("before-quit", () => {
            const bounds = mainWindow?.getBounds();
            if (bounds) {
                settings.setSync(SETTING_WINDOW_BOUNDS, bounds as any);
            }
        });
    }

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

function _createTray(): boolean {
    const iconPath = _getAppIconPath();
    if (!fs.existsSync(iconPath)) {
        console.warn(`App icon ${iconPath} does not exist. Have to start without tray!`);
        WindowSystem.disablePreventClose();
        return false;
    }

    try {
        tray = new Tray(iconPath);

        tray.setToolTip("Mod Companion");
        tray.setContextMenu(_buildTrayMenu());

        tray.on("click", () => {
            mainWindow?.show();
        });
        return true;
    } catch (e) {
        console.warn(e);
        return false;
    }
}

let zoomFactor = 1;
function _createShortcuts() {
    mainWindow?.webContents.on("before-input-event", (event, input) => {
        if (input.key.toLowerCase() === "f12") {
            event.preventDefault();
            mainWindow?.webContents.toggleDevTools();
        }

        if (input.control && !input.isAutoRepeat && input.type !== "keyUp") {
            if (input.key.toLowerCase() === "+") {
                _changeZoom(0.1);
            }
            if (input.key.toLowerCase() === "-") {
                _changeZoom(-0.1);
            }
            if (input.key.toLowerCase() === "0") {
                _resetZoom();
            }
        }
    });
}

function _changeZoom(delta: number) {
    Logger.info(SharedLogChannel.Generic, "Change zoom", delta);
    zoomFactor = Math.max(0.1, zoomFactor + delta);
    mainWindow?.webContents.setZoomFactor(zoomFactor);
}

function _resetZoom() {
    zoomFactor = 1.0;
    mainWindow?.webContents.setZoomFactor(zoomFactor);
}

function _buildTrayMenu() {
    const template: (Electron.MenuItemConstructorOptions | Electron.MenuItem)[] = [];
    template.push({ label: "Show", click: () => mainWindow?.show() });
    template.push({ type: "separator" });

    for (const option of SharedLauncherOptions) {
        template.push({ label: `${option.name}`, click: () => runLauncher(option.type, option.args) });
    }
    template.push({ type: "separator" });
    template.push({ label: "Quit", click: () => app.exit() });
    return Menu.buildFromTemplate(template);
}
