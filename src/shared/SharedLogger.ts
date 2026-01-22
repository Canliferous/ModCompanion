export enum SharedLogChannel {
    Generic = "Generic",
    GameInterop = "Game",
    ConversionAgent = "Conv Agent",
    FileBrowser = "File Browser",
}

export enum SharedLogType {
    Verbose,
    Info,
    Warning,
    Error,
}

export interface SharedLogEvent {
    data: any[];
    type: SharedLogType;
    channel: SharedLogChannel;
    time: Date;
}

export function getLogPrefix(logEvent: SharedLogEvent) {
    return `${logEvent.time.getFullYear()}-${logEvent.time.getMonth()}-${logEvent.time.getDate()} ${logEvent.time.getHours()}:${logEvent.time.getMinutes()}:${logEvent.time.getSeconds()}:${logEvent.time.getMilliseconds()} [${logEvent.channel}] : `;
}

export function printLogEvent(logEvent: SharedLogEvent) {
    const prefix = getLogPrefix(logEvent);
    switch (logEvent.type) {
        case SharedLogType.Verbose: {
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
