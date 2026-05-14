import { NetconPort } from "./SharedStrataInterop.js";

export enum Launchers {
    Game = "game",
    Hammer = "hammer",
    Hlmv = "hlmv",
    Faceposer = "faceposer",
}

export interface LauncherOption {
    name: string;
    type: Launchers;
    args?: string;
}

export const GameLauncherOptions: LauncherOption[] = [
    {
        name: "Game",
        type: Launchers.Game,
    },
    {
        name: "Game (Dev)",
        type: Launchers.Game,
        args: `-dev -condebug -novid -netconport ${NetconPort}`,
    },
    {
        name: "Game (Tools)",
        type: Launchers.Game,
        args: `-tools -netconport ${NetconPort}`,
    },
] as const;

export const ToolLauncherOptions: LauncherOption[] = [
    {
        name: "Hammer",
        type: Launchers.Hammer,
    },
    {
        name: "Faceposer",
        type: Launchers.Faceposer,
    },
    {
        name: "HLMV",
        type: Launchers.Hlmv,
    },
] as const;
