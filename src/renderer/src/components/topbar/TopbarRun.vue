<template>
    <div class="flex gap-1">
        <UButtonGroup>
            <UButton
                size="sm"
                :variant="interopStore.connected ? 'subtle' : 'outline'"
                :color="interopStore.connected ? 'success' : 'neutral'"
                @click="handleClickGame"
            >
                <MBitmapIcon :name="AppDesign.BitmapIcon.Launchers[Shared.Launchers.SharedLaunchers.Game]" />
                <span :class="interopStore.connected ? 'text-success' : 'text-muted'">
                    {{ Shared.Launchers.SharedGameLauncherOptions[lastRunGameConfig]?.name }}
                </span>
                <UIcon v-if="interopStore.connected" :name="AppDesign.Icons.InteropConnected" class="text-success" />
            </UButton>
            <UDropdownMenu
                :items="gameItems"
                :content="{
                    align: 'end',
                }"
            >
                <UButton
                    size="sm"
                    :variant="interopStore.connected ? 'subtle' : 'outline'"
                    :class="interopStore.connected ? 'text-success' : 'text-muted'"
                    :trailing-icon="AppDesign.Icons.ChevronDown"
                    :color="interopStore.connected ? 'success' : 'neutral'"
                />
            </UDropdownMenu>
        </UButtonGroup>

        <UButtonGroup>
            <template v-for="(option, i) in Shared.Launchers.SharedToolLauncherOptions" :key="i">
                <UTooltip :text="'Start ' + option.name">
                    <UButton variant="outline" size="xs" @click="() => handleClickTool(option)">
                        <MBitmapIcon :name="AppDesign.BitmapIcon.Launchers[option.type]" />
                    </UButton>
                </UTooltip>
            </template>
        </UButtonGroup>
    </div>
</template>

<script setup lang="ts">
import { AppDesign } from "~/design/AppDesign.js";
import { DropdownMenuItem } from "@nuxt/ui/components/DropdownMenu.vue.js";
import * as Shared from "mod_companion_shared";
import { useStrataInteropStore } from "~/store/StrataInteropStore.js";
import { useRememberRef } from "~/composables/useRemember.js";
import { SharedLauncherOption } from "mod_companion_shared/SharedLaunchers.js";

const interopStore = useStrataInteropStore();

const lastRunGameConfig = useRememberRef(ref<number>(1), "last-run-game-config-idx");

function handleClickGame(): void {
    const idx = Math.max(0, Math.min(lastRunGameConfig.value, Shared.Launchers.SharedGameLauncherOptions.length - 1));
    const option = Shared.Launchers.SharedGameLauncherOptions[idx];
    window.electronAPI.app.launch(option.type, option.args);
}

function handleClickTool(option: SharedLauncherOption): void {
    window.electronAPI.app.launch(option.type, option.args);
}

const gameItems = ref<DropdownMenuItem[][]>([
    Shared.Launchers.SharedGameLauncherOptions.map(
        (o, idx) =>
            ({
                label: o.name,
                onSelect(e: Event) {
                    lastRunGameConfig.value = idx;
                    window.electronAPI.app.launch(o.type, o.args);
                },
            }) satisfies DropdownMenuItem,
    ),
]);
</script>

<style scoped></style>
