import { printLogEvent, SharedLogChannel, SharedLogEvent, SharedLogType } from "Shared/SharedLogger.js";
import { useMessageLogStore } from "~/store/MessageLogStore.js";

export const Logger = {
    processLog(logEvent: SharedLogEvent, replicateToMain: boolean = false): void {
        printLogEvent(logEvent);

        useMessageLogStore().add(logEvent);

        if (replicateToMain) {
            window.electronAPI.log.sendFromRenderer(logEvent);
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
    init() {
        window.electronAPI.log.subscribeSendFromMain((logEvent) => {
            Logger.processLog(logEvent, false);
        });
    },
    dataToString(data: any[]) {
        return data.map((d) => String(d)).join(" ");
    },
};
