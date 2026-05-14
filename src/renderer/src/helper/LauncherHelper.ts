import * as Shared from "mod_companion_shared";
import { filename } from "pathe/utils";

/**
 * Opens a map in the game
 * @param mapName Path to the map path, or just its name. Must be in the maps folder
 */
export function openMapInGame(mapName: string): void {
    const n = filename(mapName);
    window.electronAPI.app.launch(
        Shared.Launchers.Launchers.Game,
        `-dev -condebug -netconport ${Shared.StrataInterop.NetconPort} +map ${n}`,
    );
}

export function openMapInHammer(vmfPath: string): void {
    window.electronAPI.app.launch(Shared.Launchers.Launchers.Hammer, vmfPath);
}
