import { defineStore } from "pinia";
import { AppDesign } from "~/design/AppDesign.js";
import MessageLogTakeOver from "~/components/takeovers/MessageLogTakeOver.vue";
import AssetWizardTakeOver from "~/components/takeovers/AssetWizardTakeOver.vue";

export enum TakeOverId {
    MessageLog,
    AssetWizard,
}

interface TakeOverDef {
    name: string;
    icon: string;
    component: Component;
}

export const TakeOverConfig: Record<TakeOverId, TakeOverDef> = {
    [TakeOverId.MessageLog]: {
        name: "Message Log",
        icon: AppDesign.Icons.TakeOver_Log,
        component: MessageLogTakeOver,
    },
    [TakeOverId.AssetWizard]: {
        name: "Create Asset",
        icon: AppDesign.Icons.TakeOver_AssetWizard,
        component: AssetWizardTakeOver,
    },
} as const;

export const useTakeOverStore = defineStore("takeover", () => {
    const openTakeOver = ref<TakeOverId | undefined>(undefined);

    function isOpen(takeOver: TakeOverId): boolean {
        return openTakeOver.value === takeOver;
    }

    function close(): void {
        openTakeOver.value = undefined;
    }

    function open(takeOver: TakeOverId): void {
        openTakeOver.value = takeOver;
    }

    return { openTakeOver, isOpen, close, open };
});
