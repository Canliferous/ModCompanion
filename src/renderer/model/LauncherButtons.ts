import { SharedLaunchers } from "Shared/SharedLaunchers.js";
import { SHARED_STRATA_INTEROP_SOCKET_PORT } from "Shared/SharedStrataInterop.js";

export interface LauncherButton {
    name: string;
    icon: string;
    binary: string;
    color: string;
    launcherType: SharedLaunchers;
    launcherArgs?: string;
}

export const launcherButtons: LauncherButton[] = [
    {
        name: "Game",
        color: "error",
        icon: "revolution",
        binary: `revolution.exe -netconport ${SHARED_STRATA_INTEROP_SOCKET_PORT}`,
        launcherType: "game",
    },
    {
        name: "Game (Dev)",
        color: "error",
        icon: "revolution",
        binary: "revolution.exe",
        launcherType: "game",
        launcherArgs: `-dev -condebug -novid -netconport ${SHARED_STRATA_INTEROP_SOCKET_PORT}`,
    },
    {
        name: "Game (Tools)",
        color: "error",
        icon: "revolution",
        binary: "revolution.exe",
        launcherType: "game",
        launcherArgs: "-tools",
    },
    {
        name: "Hammer",
        color: "success",
        icon: "hammer",
        binary: "revolution.exe",
        launcherType: "hammer",
    },
    {
        name: "Faceposer",
        color: "info",
        icon: "faceposer",
        binary: "revolution.exe",
        launcherType: "faceposer",
    },
    {
        name: "HLMV",
        color: "warning",
        icon: "hlmv",
        binary: "revolution.exe",
        launcherType: "hlmv",
    },
];

export function launch(launcherType: SharedLaunchers, launcherArgs?: string) {
    window.electronAPI.app.launch(launcherType, launcherArgs);
}
