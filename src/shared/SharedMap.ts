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

export type SharedMapPath = string;

export type SharedMapPresets = Record<string, string[]>;

export interface SharedMapTimeReport {
    maps: Map<string, number>;
    totals: Map<SharedMapPath, number>;
}

export interface SharedMapSourceDir {
    dirName: string;
    vmfNames: string[];
}
