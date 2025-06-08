export const SharedIpcChannels = {
    AppLaunch: "app_launch",
    AppExit: "app_exit",
    ConfigGet: "config_get",
    MapListSourceDirs: "map_list_source_dirs",
    MapEnqueue: "map_enqueue",
    MapQueueUpdated: "map_queue_updated",
    MapCompileLog: "map_compile_log",
    MapCompileProgress: "map_compile_progress",
    MapCreateTimeReport: "map_create_time_report",
} as const;
