import { SharedLaunchers } from "Shared/SharedLaunchers.js";
import { SHARED_STRATA_INTEROP_SOCKET_PORT } from "Shared/SharedStrataInterop.js";

export interface LauncherButton {
    name: string;
    icon: string;
    binary: string;
    launcherType: SharedLaunchers;
    launcherArgs?: string;
}

export const launcherButtons: LauncherButton[] = [
    {
        name: "Game",
        icon: "revolution",
        binary: `revolution.exe -netconport ${SHARED_STRATA_INTEROP_SOCKET_PORT}`,
        launcherType: "game",
    },
    {
        name: "Game (Dev)",
        icon: "revolution",
        binary: "revolution.exe",
        launcherType: "game",
        launcherArgs: `-dev -condebug -novid -netconport ${SHARED_STRATA_INTEROP_SOCKET_PORT}`,
    },
    {
        name: "Game (Tools)",
        icon: "revolution",
        binary: "revolution.exe",
        launcherType: "game",
        launcherArgs: `-tools -netconport ${SHARED_STRATA_INTEROP_SOCKET_PORT}`,
    },
    {
        name: "Hammer",
        icon: "hammer",
        binary: "revolution.exe",
        launcherType: "hammer",
    },
    {
        name: "Faceposer",
        icon: "faceposer",
        binary: "revolution.exe",
        launcherType: "faceposer",
    },
    {
        name: "HLMV",
        icon: "hlmv",
        binary: "revolution.exe",
        launcherType: "hlmv",
    },
];

export function launch(launcherType: SharedLaunchers, launcherArgs?: string) {
    window.electronAPI.app.launch(launcherType, launcherArgs);
}
