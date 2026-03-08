export enum CompileStep {
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

export interface CompileLogEvent {
    mapPath: string;
    step: CompileStep;
    message: string;
    isError: boolean;
}

export type QueueUpdatedNotifyFunc = (maps: string[]) => void;

export type CompileLogNotifyFunc = (event: CompileLogEvent) => void;

export interface CompileProgressEvent {
    mapPath: string;
    step: CompileStep;
    state: CompileState;
}

export type CompileProgressNotifyFunc = (event: CompileProgressEvent) => void;

export type SharedMapPresets = Record<string, string[]>;

export interface TimeReport {
    maps: Map<string, number>;
    totals: Map<string, number>;
}

export interface SharedMapSourceDir {
    dirName: string;
    vmfNames: string[];
}
