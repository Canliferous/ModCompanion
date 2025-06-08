export enum SharedMapCompileLogEventType {
    Clear,
    AppendMessage,
    AppendError,
}

interface BaseMapCompileLogEvent {
    mapPath: string;
    type: SharedMapCompileLogEventType;
}

export interface SharedMapCompileLogClearEvent extends BaseMapCompileLogEvent {
    type: SharedMapCompileLogEventType.Clear;
}

export interface SharedMapCompileLogAppendMessageEvent extends BaseMapCompileLogEvent {
    type: SharedMapCompileLogEventType.AppendMessage;
    message: string;
}

export interface SharedMapCompileLogAppendErrorEvent extends BaseMapCompileLogEvent {
    type: SharedMapCompileLogEventType.AppendError;
    message: string;
}

export type SharedMapCompileLogEvent =
    | SharedMapCompileLogClearEvent
    | SharedMapCompileLogAppendMessageEvent
    | SharedMapCompileLogAppendErrorEvent;

export function isClearEvent(event: BaseMapCompileLogEvent): event is SharedMapCompileLogClearEvent {
    return event.type === SharedMapCompileLogEventType.Clear;
}

export function isAppendMessageEvent(event: BaseMapCompileLogEvent): event is SharedMapCompileLogAppendMessageEvent {
    return event.type === SharedMapCompileLogEventType.AppendMessage;
}

export function isAppendErrorEvent(event: BaseMapCompileLogEvent): event is SharedMapCompileLogAppendErrorEvent {
    return event.type === SharedMapCompileLogEventType.AppendError;
}
