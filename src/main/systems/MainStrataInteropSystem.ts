import net from "node:net";
import {
    notifyStrataInteropConnected,
    notifyStrataInteropDisconnected,
    notifyStrataInteropLog,
} from "../api/MainStrataInteropApi.js";
import { SHARED_STRATA_INTEROP_SOCKET_PORT } from "Shared/SharedStrataInterop.js";

let socket: net.Socket | undefined = undefined;
let reconnect = true;
let healthCheckInterval: NodeJS.Timeout | undefined = undefined;
const healthCheckIntervalMs = 2000;

export function initStrataInterop(): boolean {
    _initStrataInteropSocket();
    return true;
}

export function sendStrataCommand(command: string) {
    console.log(`Sending command to strata: '${command}'`);
    socket?.write(command + "\n");
}

function _connect(port: number, timeout: number): Promise<net.Socket | undefined> {
    const promise = new Promise<net.Socket | undefined>((resolve, reject) => {
        const s = new net.Socket();
        s.setTimeout(3000);
        s.connect(port, "localhost", () => {
            resolve(s);
        });
        s.on("timeout", () => resolve(undefined));
        s.on("error", (err) => resolve(undefined));
    });

    return promise;
}

async function _healthcheck() {
    if (!socket) {
        if (reconnect) {
            const s = await _connect(SHARED_STRATA_INTEROP_SOCKET_PORT, healthCheckIntervalMs);
            if (s) {
                s.on("close", (hadError) => {
                    socket = undefined;
                    notifyStrataInteropDisconnected();
                });

                s.on("data", (data) => {
                    notifyStrataInteropLog(String(data));
                });

                socket = s;
                console.log("Strata connected");
                notifyStrataInteropConnected();
            }
        }
        return;
    }
}

function _initStrataInteropSocket(): void {
    healthCheckInterval = setInterval(() => _healthcheck(), healthCheckIntervalMs);
}
