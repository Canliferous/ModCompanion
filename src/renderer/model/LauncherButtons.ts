import { SharedLaunchers } from "Shared/SharedLaunchers.js";
import { SHARED_STRATA_INTEROP_SOCKET_PORT } from "Shared/SharedStrataInterop.js";
import { AppDesign } from "~/design/AppDesign.js";

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
        icon: AppDesign.BitmapIcon.Game,
        binary: `revolution.exe -netconport ${SHARED_STRATA_INTEROP_SOCKET_PORT}`,
        launcherType: "game",
    },
    {
        name: "Game (Dev)",
        icon: AppDesign.BitmapIcon.Game,
        binary: "revolution.exe",
        launcherType: "game",
        launcherArgs: `-dev -condebug -novid -netconport ${SHARED_STRATA_INTEROP_SOCKET_PORT}`,
    },
    {
        name: "Game (Tools)",
        icon: AppDesign.BitmapIcon.Game,
        binary: "revolution.exe",
        launcherType: "game",
        launcherArgs: `-tools -netconport ${SHARED_STRATA_INTEROP_SOCKET_PORT}`,
    },
    {
        name: "Hammer",
        icon: AppDesign.BitmapIcon.Hammer,
        binary: "revolution.exe",
        launcherType: "hammer",
    },
    {
        name: "Faceposer",
        icon: AppDesign.BitmapIcon.Faceposer,
        binary: "revolution.exe",
        launcherType: "faceposer",
    },
    {
        name: "HLMV",
        icon: AppDesign.BitmapIcon.Hlmv,
        binary: "revolution.exe",
        launcherType: "hlmv",
    },
];

export function launch(launcherType: SharedLaunchers, launcherArgs?: string) {
    window.electronAPI.app.launch(launcherType, launcherArgs);
}
