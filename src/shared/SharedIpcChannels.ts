export const SharedIpcChannels = {
    AppLaunch: "app_launch",
    AppExit: "app_exit",
    AppBrowseToFile: "app_browse_to_file",
    AppOpenFile: "app_open_file",

    ClipboardWriteText: "clipboard_write_text",

    ProjectListFiles: "project_list_files",
    ProjectCorrectPath: "project_correct_path",
    ProjectLaunchFile: "project_launch_file",

    ConfigGet: "config_get",

    MapListSourceDirs: "map_list_source_dirs",
    MapEnqueue: "map_enqueue",
    MapQueueUpdated: "map_queue_updated",
    MapCompileLog: "map_compile_log",
    MapCompileProgress: "map_compile_progress",
    MapCreateTimeReport: "map_create_time_report",

    AssetRescanned: "asset_rescanned",
    AssetAdded: "asset_added",
    AssetUpdated: "asset_updated",
    AssetForceRescan: "asset_force_rescan",
    AssetNavigateToId: "asset_navigate_to_id",
    AssetCreate: "asset_create",
    AssetUpdate: "asset_update",

    ImageGetMeta: "image_get_meta",

    ConversionEnqueue: "conversion_enqueue",
    ConversionAgentStart: "conversion_agent_start",
    ConversionAgentStop: "conversion_agent_stop",
    ConversionUpdated: "conversion_updated",
    ConversionGetState: "conversion_get_state",
    ConversionClearEvents: "conversion_clear_events",

    HotReloadSetEnabled: "hotreload_set_enabled",
    HotReloadTriggered: "hotreload_triggered",

    InteropSendCommand: "interop_send_command",
    InteropConnected: "interop_connected",
    InteropDisconnected: "interop_disconnected",
    InteropLog: "interop_log",

    AssetGroupsRescanned: "assetgroup_rescanned",
    AssetGroupsForceRescan: "assetgroup_force_rescan",
    AssetGroupsCreate: "assetgroup_create",
    AssetGroupsUpdate: "assetgroup_update",
    AssetGroupsDelete: "assetgroup_delete",
} as const;
export type SharedIpcChannel = (typeof SharedIpcChannels)[keyof typeof SharedIpcChannels];
