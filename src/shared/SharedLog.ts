export const MAX_MESSAGES = 500;

export enum Channel {
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
    Hotspot = "Hotspot",
    ArtifactCloud = "ArtifactCloud",
    Cli = "CLI",
}

export const AllChannels = [
    Channel.Generic,
    Channel.GameInterop,
    Channel.ConversionAgent,
    Channel.FileBrowser,
    Channel.Assets,
    Channel.Fgd,
    Channel.MapCompile,
    Channel.MareTF,
    Channel.HotReload,
    Channel.MainSystems,
    Channel.Hotspot,
    Channel.ArtifactCloud,
    Channel.Cli,
];

export enum Type {
    Debug,
    Info,
    Warning,
    Error,
}

export const AllTypes = [Type.Debug, Type.Info, Type.Warning, Type.Error];

export const TypeNames: Record<Type, string> = {
    [Type.Debug]: "Debug",
    [Type.Info]: "Info",
    [Type.Warning]: "Warning",
    [Type.Error]: "Error",
};

export interface Event {
    data: any[];
    type: Type;
    channel: Channel;
    time: Date;
}

export type NotifyFunc = (logEvent: Event) => void;

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

export function getLogPrefix(logEvent: Event, noDate: boolean = false, noMilliseconds: boolean = false) {
    const time = getLogTime(logEvent.time, noDate, noMilliseconds);
    const channel = `[${logEvent.channel}]`;

    return `${time} ${channel}`;
}

export function printLogEvent(logEvent: Event) {
    const prefix = getLogPrefix(logEvent);
    switch (logEvent.type) {
        case Type.Debug: {
            console.debug(prefix, ...logEvent.data);
            break;
        }
        case Type.Error: {
            console.error(prefix, ...logEvent.data);
            break;
        }
        case Type.Warning: {
            console.warn(prefix, ...logEvent.data);
            break;
        }
        case Type.Info:
        default: {
            console.log(prefix, ...logEvent.data);
            break;
        }
    }
}

export function stringifyLog(logEvent: Event, noDate: boolean = false, noMilliseconds: boolean = false): string {
    const prefix = getLogPrefix(logEvent, noDate, noMilliseconds);
    const body = logEvent.data.map((d) => d.toString()).join(" ");
    return prefix + " " + body;
}
