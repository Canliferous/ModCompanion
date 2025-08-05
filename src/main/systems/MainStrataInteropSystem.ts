import koffi from "koffi";
import os from "node:os";

const WINDOW_NAME = "Strata001";

let FindWindowA: koffi.KoffiFunction;
let SendMessageTimeoutA: koffi.KoffiFunction;

export function initStrataInterop(): boolean {
    if (os.type() === "windows_nt") {
        initStrataInteropWindows();
    } else {
        console.log("NOTE: Strata interop is not available on", os.type());
    }

    return true;
}

function initStrataInteropWindows(): void {
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
    if (os.type() === "windows_nt") {
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
