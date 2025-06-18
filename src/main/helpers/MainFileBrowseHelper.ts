import path from "path";
import * as os from "node:os";
import * as child_process from "node:child_process";

export function browseToFile(filePath: string): void {
    const normalizedPath = path.resolve(filePath);
    const platform = os.platform();

    let command = "";

    if (platform === "win32") {
        command = `explorer.exe /select,"${normalizedPath}"`;
    } else if (platform === "darwin") {
        command = `open "${normalizedPath}"`;
    } else if (platform === "linux") {
        // TODO: This doesn't actually BROWSE to the file
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
