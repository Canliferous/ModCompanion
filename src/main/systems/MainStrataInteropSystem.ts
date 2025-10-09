import koffi from "koffi";
import os from "node:os";
import net from "node:net";

const WINDOW_NAME = "Strata001";

let FindWindowA: koffi.KoffiFunction;
let SendMessageTimeoutA: koffi.KoffiFunction;

export function initStrataInterop(): boolean {
    const useSocket = true;

    if (useSocket) {
        _initStrataInteropSocket();
    } else if (os.type().toLowerCase() === "windows_nt") {
        _initStrataInteropWindows();
    } else {
        console.log("NOTE: Strata interop is not available without socket on", os.type());
    }

    return true;
}

let socket: net.Socket | undefined = undefined;
let reconnect = true;
let healthCheckInterval: NodeJS.Timeout | undefined = undefined;
const healthCheckIntervalMs = 2000;
const port = 8020;

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
        const s = await _connect(port, healthCheckIntervalMs);
        if (s) {
            socket = s;
            console.log("Strata connected");
        }
    }
}

function _initStrataInteropSocket(): void {
    healthCheckInterval = setInterval(() => _healthcheck(), healthCheckIntervalMs);
}

// 🦖🦖🦖🦖🦖🦖🦖🦖🦖🦖🦖🦖🦖🦖🦖🦖🦖🦖🦖🦖🦖🦖🦖🦖🦖🦖🦖🦖🦖🦖🦖🦖🦖🦖🦖🦖🦖🦖🦖🦖🦖v

function _initStrataInteropWindows(): void {
    const user32 = koffi.load("user32.dll");

    koffi.struct("COPYDATASTRUCT", {
        dwData: "ulong*",
        cbData: "ulong",
        lpData: "void*",
    });

    FindWindowA = user32.func("FindWindowA", "void*", ["string", "void*"]);
    SendMessageTimeoutA = user32.func("SendMessageTimeoutA", "long*", [
        "void*", // hWnd
        "uint32", // Msg
        "void*", // wParam
        "COPYDATASTRUCT*", // lParam
        "uint32", // Flags
        "uint32", // Timeout (ms)
        "void*", // lpdwResult
    ]);
}

export function isStrataRunning(): boolean {
    const hwnd = FindWindowA(WINDOW_NAME, null);
    return !!hwnd;
}

export function runStrataGameCommand(command: string): void {
    if (os.type().toLowerCase() === "windows_nt") {
        _runStrataGameCommandWindows(command);
    } else {
        console.debug("Strata interop not available on", os.type());
    }
}

function _runStrataGameCommandWindows(command: string): void {
    const hwnd = FindWindowA(WINDOW_NAME, null);
    if (!hwnd) {
        console.log("Game not running");
        return;
    }

    const WM_COPYDATA = 0x004a;
    const SMTO_ABORTIFHUNG = 0x0002;

    SendMessageTimeoutA(
        hwnd,
        WM_COPYDATA,
        0,
        {
            dwData: 0,
            cbData: command.length + 1,
            lpData: command,
        },
        SMTO_ABORTIFHUNG,
        0,
        null,
    );

    console.log(`Sent command to game '${command}'`);
}
