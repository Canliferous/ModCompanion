import fs from "node:fs/promises";

// This only exists in prod deployments
declare const __APP_VERSION__: string;

let appVersion: string = "???";

export async function determineAppVersion(): Promise<void> {
    if (process.env.NODE_ENV === "development") {
        appVersion = await fs.readFile("./version.txt", "utf-8");
    }

    appVersion = __APP_VERSION__;
}

export function getAppVersion(): string {
    return appVersion;
}
