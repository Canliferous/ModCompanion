<template>
    <div class="overflow-x-clip">
        <template v-if="logStore.latestEvent">
            <UTooltip text="Click to expand and collapse the message log">
                <UButton variant="ghost" size="xs" class="text-xs text-muted w-full" @click="handleClick">
                    <div
                        class="flex justify-start items-center gap-1 text-nowrap w-full"
                        :class="getLogTypeTextColorWarnings(logStore.latestEvent.type)"
                    >
                        <UIcon :name="isOpen ? AppDesign.Icons.ChevronUp : AppDesign.Icons.ChevronRight" />
                        <MLogTypeIcon :type="logStore.latestEvent.type" />
                        <span>
                            {{ Shared.Log.getLogPrefix(logStore.latestEvent, true, true) }}
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
import { useMessageLogStore } from "~/store/MessageLogStore.js";
import { Logger } from "~/logger.js";
import { AppDesign, getLogTypeTextColorWarnings } from "~/design/AppDesign.js";
import { TakeOverId, useTakeOverStore } from "~/store/TakeOverStore.js";
import * as Shared from "mod_companion_shared";

const logStore = useMessageLogStore();
const takeOverStore = useTakeOverStore();

const isOpen = computed(() => takeOverStore.isOpen(TakeOverId.MessageLog));

function handleClick(): void {
    if (takeOverStore.isOpen(TakeOverId.MessageLog)) {
        takeOverStore.close();
    } else {
        takeOverStore.open(TakeOverId.MessageLog);
    }
}
</script>

<style scoped></style>
