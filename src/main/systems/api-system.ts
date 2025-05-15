import { registerLauncherApi } from "../api/MainLauncherApi.js";

const apis: (() => boolean)[] = [registerLauncherApi];

export function initApiSystem(): boolean {
    for (const api of apis) {
        if (!api()) {
            console.error(`Failed to initialize api ${api.name}`);
            return false;
        }
    }

    return true;
}
