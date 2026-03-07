<template>
    <TakeOver :id="TakeOverId.MessageLog">
        <template #toolbar>
            <UCheckbox v-model="showTime" label="Show Time" size="sm" />
            <USeparator orientation="vertical" />
            <USelect
                v-model="typeFilter"
                size="sm"
                class="min-w-30"
                multiple
                :items="typeFilterItems"
                value-key="id"
                placeholder="Filter Type"
            />
            <UButton
                variant="soft"
                size="sm"
                label="Clear"
                :icon="AppDesign.Icons.ActionDelete"
                @click="logStore.clear()"
            />
            <USeparator orientation="vertical" />
        </template>
        <div ref="scroller" class="grid grid-cols-[auto_auto_auto_1fr] text-xs gap-x-1 overflow-y-scroll">
            <template v-for="(event, i) in events" :key="i">
                <div class="grid col-span-full grid-cols-subgrid odd:bg-neutral-950/50 p-1">
                    <MLogTypeIcon :type="event.type" />
                    <div v-show="showTime" class="whitespace-nowrap text-muted tabular-nums">
                        {{ getLogTime(event.time) }}
                    </div>
                    <div class="whitespace-nowrap">{{ event.channel }}</div>
                    <div :class="getLogTypeTextColorWarnings(event.type)">
                        {{ Logger.dataToString(event.data) }}
                    </div>
                </div>
            </template>
        </div>
    </TakeOver>
</template>

<script setup lang="ts">
import { useMessageLogStore } from "~/store/MessageLogStore.js";
import { AppDesign, getLogTypeTextColorWarnings } from "~/design/AppDesign.js";
import { Logger } from "~/logger.js";
import {
    getLogTime,
    Shared.Log.Channel,
    SharedLogType,
    SharedLogTypeNames,
    SharedLogTypesArray,
} from "Shared/SharedLogger.js";
import { useRememberRef } from "~/composables/useRemember.js";
import { TakeOverId } from "~/store/TakeOverStore.js";

const logStore = useMessageLogStore();

function handleTestLog() {
    Logger.debug(Shared.Log.Channel.Generic, "Hello world! Test log debug");
    Logger.info(Shared.Log.Channel.Generic, "Hello world! Test log info");
    Logger.warning(Shared.Log.Channel.Generic, "Hello world! Test log warning");
    Logger.error(Shared.Log.Channel.Generic, "Hello world! Test log error");
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
