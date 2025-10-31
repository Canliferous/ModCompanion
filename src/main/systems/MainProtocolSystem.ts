import { app, protocol, net } from "electron";
import { notifyNavigateToAssetId } from "../api/MainAssetApi.js";

export const protocolName = "modcomp";
export const protocolCommandNavigateToAsset = "asset";

interface Command {
    name: string;
    arg?: string;
}

export function initProtocolSystem(): boolean {
    // protocol.registerSchemesAsPrivileged([
    //     {
    //         scheme: protocolName,
    //         privileges: {
    //             standard: true,
    //             secure: true,
    //             supportFetchAPI: true,
    //         },
    //     },
    // ]);
    app.setAsDefaultProtocolClient(protocolName);
    app.whenReady().then(() => {
        protocol.handle(protocolName, (request): Response => {
            const command = _getProtocolCommand(request);
            if (!command) {
                return Response.error();
            }

            return _handleProtocolCommand(command);
        });
    });

    return true;
}

function _getProtocolCommand(request: Request): Command | undefined {
    const cmd = request.url.slice(`${protocolName}://`.length);
    if (cmd === "") return undefined;

    const splits = cmd.split("/");

    const name = splits[0];
    if (splits.length > 1) {
        const arg = splits.slice(1).join("/");
        return { name, arg };
    }

    return { name };
}

function _handleProtocolCommand(cmd: Command): Response {
    switch (cmd.name) {
        case protocolCommandNavigateToAsset:
            return _cmdNavigateToAsset(cmd.arg);
        default:
            return Response.error();
    }
}

function _cmdNavigateToAsset(assetId: string | undefined): Response {
    if (assetId === undefined) {
        return Response.error();
    }
    notifyNavigateToAssetId(assetId);
    return new Response();
}
