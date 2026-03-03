import net from "node:net";
// import {
//     notifyStrataInteropConnected,
//     notifyStrataInteropDisconnected,
//     notifyStrataInteropLog,
// } from "../../main/api/MainStrataInteropApi.js";
import { SHARED_STRATA_INTEROP_SOCKET_PORT } from "Shared/SharedStrataInterop.js";
import { Logger } from "./CoreLogSystem.js";
import { SharedLogChannel } from "Shared/SharedLogger.js";

let socket: net.Socket | undefined = undefined;
const reconnect = true;
let healthCheckInterval: NodeJS.Timeout | undefined = undefined;
const healthCheckIntervalMs = 2000;

export const StrataInteropSystem = {
    initSystem(): boolean {
        _initStrataInteropSocket();
        return true;
    },
    sendCommand(command: string) {
        if (socket) {
            Logger.info(SharedLogChannel.GameInterop, "Sending command to strata", command);
            socket.write(command + "\n");
        }
    },
    isConnected(): boolean {
        return socket !== undefined;
    },
};

function _connect(port: number): Promise<net.Socket | undefined> {
    const promise = new Promise<net.Socket | undefined>((resolve) => {
        const s = new net.Socket();
        s.setTimeout(3000);
        s.connect(port, "localhost", () => {
            resolve(s);
        });
        s.on("timeout", () => resolve(undefined));
        s.on("error", () => resolve(undefined));
    });

    return promise;
}

async function _healthcheck() {
    if (!socket) {
        if (reconnect) {
            const s = await _connect(SHARED_STRATA_INTEROP_SOCKET_PORT);
            if (s) {
                s.on("close", () => {
                    socket = undefined;
                    Logger.info(SharedLogChannel.GameInterop, "Strata disconnected");
                    // notifyStrataInteropDisconnected();
                });

                s.on("data", (data) => {
                    const message = String(data);
                    // notifyStrataInteropLog(message);
                });

                socket = s;
                Logger.info(SharedLogChannel.GameInterop, "Strata connected");
                // notifyStrataInteropConnected();
            }
        }
        return;
    }
}

function _initStrataInteropSocket(): void {
    healthCheckInterval = setInterval(() => _healthcheck(), healthCheckIntervalMs);
}
