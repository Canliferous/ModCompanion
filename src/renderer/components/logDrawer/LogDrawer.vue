<template>
    <!-- Dockview has z-index of 99 so we must be above it -->
    <div
        class="bg-neutral-950/50 backdrop-blur-md absolute inset-0 p-1 flex flex-col justify-end transition-opacity z-100 overflow-y-clip"
        :class="{
            'opacity-100 pointer-events-auto': logStore.drawerOpen,
            'opacity-0 pointer-events-none': !logStore.drawerOpen,
        }"
        @click.self="handleBackdropClick"
    >
        <div
            class="bg-neutral-850/50 inset-shadow-rim rounded shadow max-h-full grid grid-row-[auto_auto_minmax(0,1fr)] p-1 gap-1 transition-transform"
            :class="{
                'translate-y-0': logStore.drawerOpen,
                'translate-y-50': !logStore.drawerOpen,
            }"
        >
            <div class="flex items-center gap-2">
                <span class="pl-1 text-sm select-none">Log</span>
                <!--                <UButton size="sm" label="Add test log" @click="handleTestLog" />-->
                <div class="grow" />
                <UCheckbox v-model="showTime" label="Show Time" size="sm" />
                <USelect
                    v-model="typeFilter"
                    size="sm"
                    class="min-w-30"
                    multiple
                    :items="typeFilterItems"
                    value-key="id"
                    placeholder="Filter Type"
                />
                <UButton :icon="AppDesign.Icons.ActionMinimize" variant="ghost" size="sm" />
            </div>

            <USeparator />

            <div ref="scroller" class="grid grid-cols-[auto_auto_auto_1fr] text-xs gap-x-1 overflow-y-scroll">
                <template v-for="event in events" :key="event.time.getTime()">
                    <div class="grid col-span-full grid-cols-subgrid odd:bg-neutral-950/50 p-1">
                        <MLogTypeIcon :type="event.type" />
                        <div class="text-muted tabular-nums" v-show="showTime">{{ getLogTime(event.time) }}</div>
                        <div>{{ event.channel }}</div>
                        <div :class="getLogTypeTextColorWarnings(event.type)">
                            {{ Logger.dataToString(event.data) }}
                        </div>
                    </div>
                </template>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useLogStore } from "~/store/LogStore.js";
import { AppDesign, getLogTypeTextColorWarnings } from "~/design/AppDesign.js";
import { Logger } from "~/logger.js";
import {
    getLogTime,
    SharedLogChannel,
    SharedLogType,
    SharedLogTypeNames,
    SharedLogTypesArray,
} from "Shared/SharedLogger.js";
import { useRememberRef } from "~/composables/useRemember.js";

const logStore = useLogStore();

function handleBackdropClick() {
    logStore.drawerOpen = false;
}

function handleTestLog() {
    Logger.debug(SharedLogChannel.Generic, "Hello world! Test log debug");
    Logger.info(SharedLogChannel.Generic, "Hello world! Test log info");
    Logger.warning(SharedLogChannel.Generic, "Hello world! Test log warning");
    Logger.error(SharedLogChannel.Generic, "Hello world! Test log error");
}

const showTime = useRememberRef(ref(true), "log-show-time");

const events = computed(() => logStore.logEvents.filter((e) => passesTypeFilter(e.type)));

const typeFilter = useRememberRef(ref<SharedLogType[]>([]), "log-type-filter");
const typeFilterItems = SharedLogTypesArray.map((t) => ({
    id: t,
    label: SharedLogTypeNames[t],
}));
function passesTypeFilter(logType: SharedLogType): boolean {
    return typeFilter.value.length === 0 ? true : typeFilter.value.includes(logType);
}

const scroller = useTemplateRef("scroller");

watch(
    () => logStore.logEvents.length,
    () => {
        nextTick(() => {
            if (scroller.value) {
                scroller.value.scrollTop = scroller.value.scrollHeight;
            }
        });
    },
);
</script>

<style scoped></style>
