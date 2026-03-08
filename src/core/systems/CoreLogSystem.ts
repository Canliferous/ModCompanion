// import { notifyLogFromMain } from "../../main/api/MainLoggerApi.js";
import * as Shared from "mod_companion_shared";

let notifyFunc: Shared.Log.NotifyFunc | undefined = undefined;

export const Logger = {
    initSystem(func?: Shared.Log.NotifyFunc): boolean {
        notifyFunc = func;
        return true;
    },
    processLog(logEvent: Shared.Log.Event, replicateToRenderer: boolean = false) {
        Shared.Log.printLogEvent(logEvent);

        if (replicateToRenderer) {
            notifyFunc?.(logEvent);
        }
    },
    debug(channel: Shared.Log.Channel, ...data: any[]) {
        Logger.processLog({ data, channel, time: new Date(), type: Shared.Log.Type.Debug }, true);
    },
    info(channel: Shared.Log.Channel, ...data: any[]) {
        Logger.processLog({ data, channel, time: new Date(), type: Shared.Log.Type.Info }, true);
    },
    warning(channel: Shared.Log.Channel, ...data: any[]) {
        Logger.processLog({ data, channel, time: new Date(), type: Shared.Log.Type.Warning }, true);
    },
    error(channel: Shared.Log.Channel, ...data: any[]) {
        Logger.processLog({ data, channel, time: new Date(), type: Shared.Log.Type.Error }, true);
    },
};
