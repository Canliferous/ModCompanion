import { SharedMapCompileState, SharedMapCompileStep } from "./SharedMapCompile.js";

export interface SharedMapCompileProgressEvent {
    mapPath: string;
    step: SharedMapCompileStep;
    state: SharedMapCompileState;
}
