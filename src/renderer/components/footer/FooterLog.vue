<template>
    <div class="overflow-x-clip">
        <template v-if="logStore.latestEvent">
            <UTooltip text="Click to expand and collapse the message log">
                <UButton variant="ghost" size="xs" class="text-xs text-muted w-full" @click="handleClick">
                    <div
                        class="flex justify-start items-center gap-1 text-nowrap w-full"
                        :class="getLogTypeTextColorWarnings(logStore.latestEvent.type)"
                    >
                        <UIcon :name="logStore.drawerOpen ? AppDesign.Icons.ChevronUp : AppDesign.Icons.ChevronRight" />
                        <MLogTypeIcon :type="logStore.latestEvent.type" />
                        <span>
                            {{ getLogPrefix(logStore.latestEvent, true, true) }}
                        </span>
                        <span>
                            {{ Logger.dataToString(logStore.latestEvent.data) }}
                        </span>
                    </div>
                </UButton>
            </UTooltip>
        </template>
    </div>
</template>

<script setup lang="ts">
import { useLogStore } from "~/store/LogStore.js";
import { Logger } from "~/logger.js";
import { getLogPrefix } from "Shared/SharedLogger.js";
import { AppDesign, getLogTypeTextColorWarnings } from "~/design/AppDesign.js";

const logStore = useLogStore();

function handleClick() {
    logStore.toggleDrawer();
}
</script>

<style scoped></style>
