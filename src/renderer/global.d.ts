import * as Shared from "mod_companion_shared";
import { Stream } from "node:stream";

export {};

declare global {
    interface Window {
        electronAPI: {
            app: {
                launch: (launcherType: Shared.Launchers.SharedLaunchers, launcherArgs: string | undefined) => void;
                exit: () => void;
            };

            fileBrowser: {
                listFiles: (dirPath: string) => Promise<Shared.FileListing.SharedProjectListFilesReport>;
                indexFiles: () => void;
                correctPath: (dirPath: string) => Promise<string | undefined>;
                launchFile: (filePath: string | string[]) => void;
                setCurrentPath: (dirPath: string) => void;
                browseToFile: (filePath: string) => void;
                openFile: (filePath: string | string[]) => void;
                subscribeDirUpdated: (callback: (event: Shared.FileListing.DirUpdatedReport) => void) => IpcRenderer;
            };

            file: {
                readString: (filePath: string) => Promise<string>;
                writeString: (
                    filePath: string,
                    data:
                        | string
                        | NodeJS.ArrayBufferView
                        | Iterable<string | NodeJS.ArrayBufferView>
                        | AsyncIterable<string | NodeJS.ArrayBufferView>
                        | Stream,
                ) => Promise<void>;
            };

            config: {
                get: () => Promise<Shared.AppConfig.IAppConfig>;
            };

            map: {
                listSourceDirs: () => Promise<Shared.Map.SharedMapSourceDir[]>;
                enqueue: (mapPaths: string[]) => void;
                subscribeQueueUpdated: (callback: (queue: string[]) => void) => IpcRenderer;
                cancelQueue: () => void;
                pauseQueue: (paused: boolean) => void;
                subscribeCompileLog: (callback: (event: Shared.Map.CompileLogEvent) => void) => IpcRenderer;
                subscribeCompileProgress: (callback: (event: Shared.Map.CompileProgressEvent) => void) => IpcRenderer;
                createTimeReport: (maps: string[]) => Promise<Shared.Map.TimeReport>;
            };

            asset: {
                rescan: () => Promise<Shared.Asset.SharedAssetRescanEvent>;
                subscribeAdded: (callback: (event: Shared.Asset.SharedAssetAddedEvent) => void) => IpcRenderer;
                subscribeUpdated: (callback: (event: Shared.Asset.SharedAssetUpdatedEvent) => void) => IpcRenderer;
                subscribeNavigateToHash: (callback: (assetHash: string) => void) => IpcRenderer;
                createAsset: (
                    primaryFile: string,
                    otherFiles: string[],
                ) => Promise<Shared.Asset.SharedCreateAssetReport>;
                createEmpty: (mcaFilePath: string) => Promise<Shared.Asset.SharedCreateAssetReport>;
                update: (
                    assetId: Shared.Asset.AssetId,
                    assetDef: Shared.Asset.SharedAssetDefinition,
                ) => Promise<Shared.Asset.SharedAsset | undefined>;
                delete: (assetId: Shared.Asset.AssetId) => Promise<boolean>;
            };

            assetGroups: {
                forceRescan: () => void;
                subscribeRescanned: (callback: (event: Shared.AssetGroup.RescanEvent) => void) => IpcRenderer;
                create: (groupDef: Shared.AssetGroup.GroupDefinition) => Promise<Shared.AssetGroup.SharedAssetGroup>;
                update: (
                    groupId: Shared.AssetGroup.GroupId,
                    groupDef: Shared.AssetGroup.GroupDefinition,
                ) => Promise<Shared.AssetGroup.SharedAssetGroup>;
                delete: (groupId: Shared.AssetGroup.GroupId) => void;
            };

            image: {
                getMeta: (imageFilePath: string) => Promise<Shared.ImageMeta.SharedImageMetaReport | undefined>;
            };

            conversion: {
                enqueue: (assetId: Shared.Asset.AssetId) => void;
                enqueueAll: () => void;
                startAgent: () => void;
                stopAgent: () => void;
                subscribeUpdated: (callback: (event: Shared.Conversion.UpdateEvent) => void) => IpcRenderer;
                getState: () => Promise<Shared.Conversion.SharedConversionGetStateIpcReport>;
                clearEvents: () => void;
            };

            hotReload: {
                setEnabled: (enable: boolean) => void;
                reloadChamberSignConfig: () => void;
            };

            webUtils: {
                getPathForFile: (file: File) => string;
            };

            clipboard: {
                writeText: (text: string, type?: "selection" | "clipboard") => void;
            };

            interop: {
                subscribeConnected: (callback: () => void) => IpcRenderer;
                subscribeDisconnected: (callback: () => void) => IpcRenderer;
                subscribeLog: (callback: (message: string) => void) => IpcRenderer;
                sendCommand: (command: string) => void;
            };

            fgd: {
                build: () => Promise<boolean>;
            };

            tcArtifacts: {
                isConnected: () => Promise<boolean>;
                listAllMaps: () => Promise<Shared.TcArtifacts.ListAllMapsReport | undefined>;
                downloadMap: (artifactKey: string, mapPath: string) => Promise<boolean>;
            };

            log: {
                sendFromRenderer: (event: Shared.Log.Event) => void;
                subscribeSendFromMain: (callback: (event: Shared.Log.Event) => void) => IpcRenderer;
            };

            mdl: {
                info: (filePath: string) => Promise<Shared.MdlInfo.SharedMdlInfoReport>;
            };
        };
    }
}
