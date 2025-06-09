import { SharedSeconds } from "./SharedTypes.js";
import { SharedMapPath } from "./SharedMapPath.js";

export interface SharedMapTimeReport {
    maps: Map<string, SharedSeconds>;
    totals: Map<SharedMapPath, SharedSeconds>;
}
