import { printLogEvent, SharedLogChannel, SharedLogEvent, SharedLogType } from "Shared/SharedLogger.js";
import { notifyLogFromMain } from "../api/MainLoggerApi.js";

export const Logger = {
    initSystem(): boolean {
        return true;
    },
    processLog(logEvent: SharedLogEvent, replicateToRenderer: boolean = false) {
        printLogEvent(logEvent);

        if (replicateToRenderer) {
            notifyLogFromMain(logEvent);
        }
    },
    debug(channel: SharedLogChannel, ...data: any[]) {
        Logger.processLog({ data, channel, time: new Date(), type: SharedLogType.Debug }, true);
    },
    info(channel: SharedLogChannel, ...data: any[]) {
        Logger.processLog({ data, channel, time: new Date(), type: SharedLogType.Info }, true);
    },
    warning(channel: SharedLogChannel, ...data: any[]) {
        Logger.processLog({ data, channel, time: new Date(), type: SharedLogType.Warning }, true);
    },
    error(channel: SharedLogChannel, ...data: any[]) {
        Logger.processLog({ data, channel, time: new Date(), type: SharedLogType.Error }, true);
    },
};
