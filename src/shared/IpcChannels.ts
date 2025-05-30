export const IpcChannels = {
    AppLaunch: "app_launch",
    AppExit: "app_exit",
    ConfigGet: "config_get",
    MapListSourceDirs: "map_list_source_dirs",
    MapEnqueue: "map_enqueue",
    MapQueueUpdated: "map_queue_updated",
} as const;
