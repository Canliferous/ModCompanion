import path from "path";
import * as os from "node:os";
import * as child_process from "node:child_process";
import { existsSync } from "fs";

export function browseToFile(filePath: string): void {
    const normalizedPath = path.resolve(filePath);

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
        // TODO: This doesn't actually BROWSE to the file
        return `xdg-open "${filePath}"`;
    }

    return undefined;
}

function _getBrowseToDirectoryCommand(dirPath: string): string | undefined {
    const platform = os.platform();

    if (platform === "win32") {
        return `explorer.exe "${dirPath}"`;
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
