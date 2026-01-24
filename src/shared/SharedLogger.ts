export enum SharedLogChannel {
    Generic = "Generic",
    GameInterop = "Game",
    ConversionAgent = "Conv Agent",
    FileBrowser = "File Browser",
    Assets = "Assets",
    Fgd = "FGD",
    MapCompile = "Map Compile",
    MareTF = "MareTF",
    HotReload = "Hot Reload",
    MainSystems = "Main Systems",
}

export enum SharedLogType {
    Debug,
    Info,
    Warning,
    Error,
}

export const SharedLogTypesArray = [
    SharedLogType.Debug,
    SharedLogType.Info,
    SharedLogType.Warning,
    SharedLogType.Error,
];

export const SharedLogTypeNames: Record<SharedLogType, string> = {
    [SharedLogType.Debug]: "Debug",
    [SharedLogType.Info]: "Info",
    [SharedLogType.Warning]: "Warning",
    [SharedLogType.Error]: "Error",
};

export interface SharedLogEvent {
    data: any[];
    type: SharedLogType;
    channel: SharedLogChannel;
    time: Date;
}

export function getLogTime(date: Date, noDate: boolean = false, noMilliseconds: boolean = false): string {
    const h = date.getHours().toString(10).padStart(2, "0");
    const m = date.getMinutes().toString(10).padStart(2, "0");
    const s = date.getSeconds().toString(10).padStart(2, "0");
    const ms = date.getMilliseconds().toString(10).padStart(3, "0");
    const time = noMilliseconds ? `${h}:${m}:${s}` : `${h}:${m}:${s}:${ms}`;

    if (noDate) {
        return time;
    }

    const y = date.getFullYear().toString(10).padStart(2, "0");
    const M = (date.getMonth() + 1).toString(10).padStart(2, "0");
    const d = date.getDate().toString(10).padStart(2, "0");
    return `${y}-${M}-${d} ${time}`;
}

export function getLogPrefix(logEvent: SharedLogEvent, noDate: boolean = false, noMilliseconds: boolean = false) {
    const time = getLogTime(logEvent.time, noDate, noMilliseconds);
    const channel = `[${logEvent.channel}]`;

    return `${time} ${channel}`;
}

export function printLogEvent(logEvent: SharedLogEvent) {
    const prefix = getLogPrefix(logEvent);
    switch (logEvent.type) {
        case SharedLogType.Debug: {
            console.debug(prefix, ...logEvent.data);
            break;
        }
        case SharedLogType.Error: {
            console.error(prefix, ...logEvent.data);
            break;
        }
        case SharedLogType.Warning: {
            console.warn(prefix, ...logEvent.data);
            break;
        }
        case SharedLogType.Info:
        default: {
            console.log(prefix, ...logEvent.data);
            break;
        }
    }
}
