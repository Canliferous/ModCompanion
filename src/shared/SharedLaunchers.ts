import { NetconPort } from "./SharedStrataInterop.js";

export enum SharedLaunchers {
    Game = "game",
    Hammer = "hammer",
    Hlmv = "hlmv",
    Faceposer = "faceposer",
}

export interface SharedLauncherOption {
    name: string;
    type: SharedLaunchers;
    args?: string;
}

export const SharedLauncherOptions: SharedLauncherOption[] = [
    {
        name: "Game",
        type: SharedLaunchers.Game,
    },
    {
        name: "Game (Dev)",
        type: SharedLaunchers.Game,
        args: `-dev -condebug -novid -netconport ${NetconPort}`,
    },
    {
        name: "Game (Tools)",
        type: SharedLaunchers.Game,
        args: `-tools -netconport ${NetconPort}`,
    },
    {
        name: "Hammer",
        type: SharedLaunchers.Hammer,
    },
    {
        name: "Faceposer",
        type: SharedLaunchers.Faceposer,
    },
    {
        name: "HLMV",
        type: SharedLaunchers.Hlmv,
    },
] as const;
