import koffi from "koffi";

const user32 = koffi.load("user32.dll");

const WM_COPYDATA = 0x004a;
const SMTO_ABORTIFHUNG = 0x0002;

const COPYDATASTRUCT = koffi.struct("COPYDATASTRUCT", {
    dwData: "ulong*",
    cbData: "ulong",
    lpData: "void*",
});

const FindWindowA = user32.func("FindWindowA", "void*", ["string", "void*"]);
const SendMessageTimeoutA = user32.func("SendMessageTimeoutA", "long*", [
    "void*", // hWnd
    "uint32", // Msg
    "void*", // wParam
    "COPYDATASTRUCT*", // lParam
    "uint32", // Flags
    "uint32", // Timeout (ms)
    "void*", // lpdwResult
]);

export function runStrataGameCommand(command: string): void {
    const hwnd = FindWindowA("Strata001", null);
    if (!hwnd) {
        console.log("Game not running");
        return;
    }

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

    console.log("Sent command to game", command);
}
