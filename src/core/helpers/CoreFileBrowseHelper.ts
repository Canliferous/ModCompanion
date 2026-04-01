import path from "path";
import * as os from "node:os";
import * as child_process from "node:child_process";
import { existsSync } from "fs";
import { ConfigSystem } from "../systems/CoreConfigSystem.js";
import { Logger } from "../systems/CoreLogSystem.js";
import * as Shared from "mod_companion_shared";

export function browseToFile(filePath: string, base?: Shared.FileBrowser.PathBase): void {
    const fullPath = Shared.FileBrowser.makeAbsolute(filePath, base, ConfigSystem.getAppConfig());
    let command: string | undefined = undefined;

    if (!existsSync(fullPath)) {
        Logger.info(Shared.Log.Channel.FileBrowser, "Browsing to file that doesn't exist, opening folder", fullPath);
        command = _getBrowseToDirectoryCommand(path.dirname(fullPath));
    } else {
        command = _getBrowseToFileSelectCommand(fullPath);
    }

    if (command === undefined) {
        Logger.error(Shared.Log.Channel.FileBrowser, "Cannot browse, unsupported OS");
        return;
    }

    Logger.info(Shared.Log.Channel.FileBrowser, "Running", command);
    child_process.exec(
        command,
        {
            env: {
                ...process.env,
                LANG: "en_US.UTF-8",
                LC_ALL: "en_US.UTF-8",
            },
        },
        (error) => {
            if (error) {
                Logger.error(Shared.Log.Channel.FileBrowser, `Failed: ${error.message}`);
            }
        },
    );
}

function _getBrowseToFileSelectCommand(filePath: string): string | undefined {
    const platform = os.platform();

    if (platform === "win32") {
        return `explorer.exe /select,"${filePath}"`;
    } else if (platform === "linux") {
        return _getBrowseToFileSelectCommandLinux(filePath);
    }

    return undefined;
}

export function _getBrowseToFileSelectCommandLinux(filePath: string): string | undefined {
    const fileManagers = [
        { mime: "org.kde.dolphin.desktop", cmd: (p: string) => `dolphin --select "${p}"` },
        { mime: "org.gnome.Nautilus.desktop", cmd: (p: string) => `nautilus --select "${p}"` },
        { mime: "nemo.desktop", cmd: (p: string) => `nemo "${p}"` },
        { mime: "thunar.desktop", cmd: (p: string) => `thunar "${path.dirname(p)}"` },
    ];

    // get the default file manager
    const defaultFileManager = child_process.execSync("xdg-mime query default inode/directory").toString().trim();
    for (const fm of fileManagers) {
        if (fm.mime === defaultFileManager) {
            return fm.cmd(filePath);
        }
    }

    // fallback
    return `xdg-open "${path.dirname(filePath)}"`;
}

function _getBrowseToDirectoryCommand(dirPath: string): string | undefined {
    const platform = os.platform();

    if (platform === "win32") {
        return `explorer.exe "${dirPath}"`;
    }
    if (platform === "linux") {
        return `xdg-open "${dirPath}"`;
    }

    return undefined;
}

export function openFile(filePath: string, base?: Shared.FileBrowser.PathBase): void {
    const fullPath = Shared.FileBrowser.makeAbsolute(filePath, base, ConfigSystem.getAppConfig());
    const platform = os.platform();

    let command = "";

    if (platform === "win32") {
        command = `"${fullPath}"`;
    } else if (platform === "darwin") {
        command = `open "${fullPath}"`;
    } else if (platform === "linux") {
        command = `xdg-open "${fullPath}"`;
    } else {
        Logger.error(Shared.Log.Channel.FileBrowser, `Unsupported platform: ${platform}`);
        return;
    }

    child_process.exec(command, (error) => {
        if (error) {
            Logger.error(Shared.Log.Channel.FileBrowser, `Failed to open: ${error.message}`);
        }
    });
}

export function executeFile(file: string, base?: Shared.FileBrowser.PathBase): void {
    let p = Shared.FileBrowser.makeAbsolute(file, base, ConfigSystem.getAppConfig());

    Logger.info(Shared.Log.Channel.FileBrowser, "Executing file", p);

    try {
        child_process.execFile(p, { shell: true }, (error, stdout, stderr) => {
            if (error) {
                Logger.warning(Shared.Log.Channel.FileBrowser, error);
            }
            if (stdout) {
                Logger.info(Shared.Log.Channel.FileBrowser, stdout);
            }
            if (stderr) {
                Logger.warning(Shared.Log.Channel.FileBrowser, stderr);
            }
        });
    } catch (e) {
        Logger.warning(Shared.Log.Channel.FileBrowser, e);
    }
}
