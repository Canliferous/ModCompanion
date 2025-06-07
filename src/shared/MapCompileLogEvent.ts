export enum MapCompileLogEventType {
    Clear,
    AppendMessage,
    AppendError,
}

interface BaseMapCompileLogEvent {
    mapPath: string;
    type: MapCompileLogEventType;
}

export interface MapCompileLogClearEvent extends BaseMapCompileLogEvent {
    type: MapCompileLogEventType.Clear;
}

export interface MapCompileLogAppendMessageEvent extends BaseMapCompileLogEvent {
    type: MapCompileLogEventType.AppendMessage;
    message: string;
}

export interface MapCompileLogAppendErrorEvent extends BaseMapCompileLogEvent {
    type: MapCompileLogEventType.AppendError;
    message: string;
}

export type MapCompileLogEvent =
    | MapCompileLogClearEvent
    | MapCompileLogAppendMessageEvent
    | MapCompileLogAppendErrorEvent;

export function isClearEvent(event: BaseMapCompileLogEvent): event is MapCompileLogClearEvent {
    return event.type === MapCompileLogEventType.Clear;
}

export function isAppendMessageEvent(event: BaseMapCompileLogEvent): event is MapCompileLogAppendMessageEvent {
    return event.type === MapCompileLogEventType.AppendMessage;
}

export function isAppendErrorEvent(event: BaseMapCompileLogEvent): event is MapCompileLogAppendErrorEvent {
    return event.type === MapCompileLogEventType.AppendError;
}
