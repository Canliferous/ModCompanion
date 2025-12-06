import { SharedMapCompileStep } from "./SharedMapCompile.js";

export interface SharedMapCompileLogEvent {
    mapPath: string;
    step: SharedMapCompileStep;
    message: string;
    isError: boolean;
}
