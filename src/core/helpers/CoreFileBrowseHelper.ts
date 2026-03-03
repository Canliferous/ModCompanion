import path from "path";
import * as os from "node:os";
import * as child_process from "node:child_process";
import { existsSync } from "fs";
import { getAppConfig } from "~/systems/CoreConfigSystem.js";
import { Logger } from "~/systems/CoreLogSystem.js";
import { SharedLogChannel } from "Shared/SharedLogger.js";

export function browseToFile(filePath: string): void {
    const normalizedPath = path.join(getAppConfig().rootPath, filePath);

    let command: string | undefined = undefined;

    if (!existsSync(normalizedPath)) {
        Logger.info(
            SharedLogChannel.FileBrowser,
            "Browsing to file that doesn't exist, opening folder",
            normalizedPath,
        );
        command = _getBrowseToDirectoryCommand(path.dirname(normalizedPath));
    } else {
        command = _getBrowseToFileSelectCommand(normalizedPath);
    }

    if (command === undefined) {
        Logger.error(SharedLogChannel.FileBrowser, "Cannot browse, unsupported OS");
        return;
    }

    Logger.info(SharedLogChannel.FileBrowser, "Running", command);
    child_process.exec(command, (error) => {
        if (error) {
            Logger.error(SharedLogChannel.FileBrowser, `Failed: ${error.message}`);
        }
    });
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

export function openFile(filePath: string): void {
    const normalizedPath = path.resolve(filePath);
    const platform = os.platform();

    let command = "";

    if (platform === "win32") {
        command = `"${normalizedPath}"`;
    } else if (platform === "darwin") {
        command = `open "${normalizedPath}"`;
    } else if (platform === "linux") {
        command = `xdg-open "${normalizedPath}"`;
    } else {
        Logger.error(SharedLogChannel.FileBrowser, `Unsupported platform: ${platform}`);
        return;
    }

    child_process.exec(command, (error) => {
        if (error) {
            Logger.error(SharedLogChannel.FileBrowser, `Failed to open: ${error.message}`);
        }
    });
}
