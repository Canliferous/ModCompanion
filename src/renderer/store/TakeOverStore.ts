import { defineStore } from "pinia";
import { AppDesign } from "~/design/AppDesign.js";

export enum TakeOverId {
    MessageLog,
    AssetWizard,
}

interface TakeOverDef {
    name: string;
    icon: string;
}

export const TakeOverConfig: Record<TakeOverId, TakeOverDef> = {
    [TakeOverId.MessageLog]: {
        name: "Message Log",
        icon: AppDesign.Icons.Log,
    },
    [TakeOverId.AssetWizard]: {
        name: "Create Asset",
        icon: AppDesign.Icons.Asset,
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
