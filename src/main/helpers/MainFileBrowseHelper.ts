import path from "path";
import * as os from "node:os";
import * as child_process from "node:child_process";
import { existsSync } from "fs";
import { getAppConfig } from "../systems/MainConfigSystem.js";

export function browseToFile(filePath: string): void {
    const normalizedPath = path.resolve(path.join(getAppConfig().rootPath, filePath));

    let command: string | undefined = undefined;

    if (!existsSync(normalizedPath)) {
        console.log("Browsing to file that doesn't exist, opening folder", filePath);
        command = _getBrowseToDirectoryCommand(path.dirname(normalizedPath));
    } else {
        command = _getBrowseToFileSelectCommand(normalizedPath);
    }

    if (command === undefined) {
        console.error("Cannot browse, unsupported OS");
        return;
    }

    console.log("Running", command);
    child_process.exec(command, (error) => {
        if (error) {
            console.error(`Failed: ${error.message}`);
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
        { name: "dolphin", cmd: (p: string) => `dolphin --select "${p}"` },
        { name: "nautilus", cmd: (p: string) => `nautilus --select "${p}"` },
        { name: "nemo", cmd: (p: string) => `nemo --select "${p}"` },
        { name: "caja", cmd: (p: string) => `caja --no-desktop --browser --select "${p}"` },
        { name: "thunar", cmd: (p: string) => `thunar "${path.dirname(p)}"` },
        { name: "xdg-open", cmd: (p: string) => `xdg-open "${path.dirname(p)}"` },
    ];

    for (const fm of fileManagers) {
        try {
            child_process.execSync(`command -v ${fm.name}`, { stdio: "ignore" });
            return fm.cmd(filePath);
        } catch {}
    }

    return undefined;
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
        console.error(`Unsupported platform: ${platform}`);
        return;
    }

    child_process.exec(command, (error) => {
        if (error) {
            console.error(`Failed to open: ${error.message}`);
        }
    });
}
