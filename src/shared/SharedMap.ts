export enum SharedMapCompileStep {
    VBsp,
    Post,
    VVis,
    VRad,
    Game,
    Done,
}

export enum CompileState {
    Idle,
    InProgress,
    Completed,
}

export interface SharedMapCompileLogEvent {
    mapPath: string;
    step: SharedMapCompileStep;
    message: string;
    isError: boolean;
}

export interface SharedMapCompileProgressEvent {
    mapPath: string;
    step: SharedMapCompileStep;
    state: CompileState;
}

export type SharedMapPresets = Record<string, string[]>;

export interface TimeReport {
    maps: Map<string, number>;
    totals: Map<string, number>;
}

export interface SharedMapSourceDir {
    dirName: string;
    vmfNames: string[];
}
