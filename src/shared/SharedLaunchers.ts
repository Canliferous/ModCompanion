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

export const SharedGameLauncherOptions: SharedLauncherOption[] = [
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
] as const;

export const SharedToolLauncherOptions: SharedLauncherOption[] = [
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
